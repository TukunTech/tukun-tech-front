import {ApplicationRef} from '@angular/core';
import {Router, NavigationStart, NavigationEnd} from '@angular/router';

export interface UxMetricEvent {
  metric: 'end_to_end_latency_ms' | 'perceived_fluidity_score';
  value: number;
  at: string;
  route?: string;
  attrs?: Record<string, string | number | boolean | null | undefined>;
}

declare global {
  interface Window {
    __UXQ?: UxMetricEvent[];
    ux?: any;
    fps_sample?: () => Promise<number>;
  }
}


function normalizeRoute(r?: string): string | undefined {
  try {
    if (!r) return undefined;
    const u = new URL(r, location.origin);
    return u.pathname || r;
  } catch {
    return r;
  }
}

function defaultAttrs(): Record<string, string | number | boolean> {
  const n: any = (navigator as any);
  const conn = n?.connection?.effectiveType ?? '';
  const dm = n?.deviceMemory ?? '';
  const plat = (n?.userAgentData?.platform ?? navigator.platform ?? '').toString();
  const uaBrand = (n?.userAgentData?.brands?.[0]?.brand ?? '').toString();

  return {
    page_visibility: document.visibilityState,
    conn_type: conn,
    device_mem_gb: dm || '',
    platform: plat,
    ua: uaBrand || '',
  };
}


export function emitUx(
  metric: UxMetricEvent['metric'],
  value: number,
  route?: string,
  attrs?: UxMetricEvent['attrs'],
): void {
  try {
    const r = normalizeRoute(route);
    const mergedAttrs: Record<string, any> = {
      ...defaultAttrs(),
      ...(attrs ?? {}),
      type: metric,
      ...(r ? {route: r} : {}),
    };

    const evt: UxMetricEvent = {
      metric,
      value,
      route: r,
      attrs: mergedAttrs,
      at: new Date().toISOString(),
    };

    (window.__UXQ ||= []).push(evt);
    performance.mark?.(`ux:${metric}:mark`, {detail: evt as any});
  } catch {
    /* no-op */
  }
}


export function markRouteStart(routeLabel: string): void {
  try {
    performance.mark?.(`ux:route:${routeLabel}:start`);
  } catch { /* no-op */
  }
}

export function markRouteDone(routeLabel: string): number | undefined {
  const start = `ux:route:${routeLabel}:start`;
  const end = `ux:route:${routeLabel}:end`;

  try {
    performance.mark?.(end);
    if (performance.getEntriesByName(start).length > 0) {
      performance.measure?.(`ux:route:${routeLabel}:measure`, start, end);
      const measures = performance.getEntriesByName(
        `ux:route:${routeLabel}:measure`,
        'measure',
      ) as PerformanceMeasure[];
      const last = measures[measures.length - 1];
      const ms = Math.max(0, last?.duration ?? 0);

      emitUx('end_to_end_latency_ms', Math.round(ms), routeLabel);
      return ms;
    }
  } catch { /* no-op */
  }
  return undefined;
}


export interface FpsOptions {
  emaAlpha?: number;
  emitIntervalMs?: number;
  jankThresholdMs?: number;
}

export function startFpsMonitor(
  getRoute: () => string,
  opts?: FpsOptions,
): () => void {
  const alpha = clamp(opts?.emaAlpha ?? 0.25, 0.05, 0.9);
  const emitEvery = Math.max(500, opts?.emitIntervalMs ?? 2000);
  const jankMs = Math.max(16, opts?.jankThresholdMs ?? 50);

  let rafId = 0;
  let lastTs = performance.now();
  let emaFrameMs = 16.7;
  let lastEmit = performance.now();
  let running = true;

  const loop = (ts: number) => {
    if (!running) return;
    const dt = ts - lastTs;
    lastTs = ts;

    emaFrameMs = alpha * dt + (1 - alpha) * emaFrameMs;
    if (dt > jankMs) {
      emaFrameMs = Math.max(emaFrameMs, dt * 0.75);
    }

    const fps = 1000 / Math.max(1, emaFrameMs);
    const score = fpsToScore(fps);

    if (ts - lastEmit >= emitEvery) {
      const r = normalizeRoute(getRoute());
      emitUx('perceived_fluidity_score', Math.round(score), r);
      lastEmit = ts;
    }

    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);

  return () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  };
}


export function initUxMetrics(appRef: ApplicationRef, router: Router): void {
  let currentRoute = '';

  router.events.subscribe((ev) => {
    if (ev instanceof NavigationStart) {
      currentRoute = ev.url ?? '';
      markRouteStart(currentRoute);
    } else if (ev instanceof NavigationEnd) {
      currentRoute = ev.urlAfterRedirects ?? ev.url ?? '';
      markRouteDone(currentRoute);
    }
  });

  const stopFps = startFpsMonitor(() => currentRoute, {
    emitIntervalMs: 2000,
    jankThresholdMs: 60,
  });

  window.addEventListener('beforeunload', () => {
    try {
      stopFps?.();
    } catch { /* no-op */
    }
  });
}


function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function fpsToScore(fps: number): number {
  const max = 60;
  const x = clamp(fps, 0, max) / max;
  const eased = 1 - Math.pow(1 - x, 3);
  return eased * 100;
}


(() => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w.ux) return;

  const getQ = () => {
    const q = (w as any).__UXQ;
    if (Array.isArray(q)) {
      return {
        peek: () => q as UxMetricEvent[],
        clear: () => {
          q.length = 0;
        },
      };
    }
    return null;
  };

  w.ux = {
    dump() {
      const q = getQ();
      if (!q) return console.warn('ux.dump: queue not ready');
      const arr = q.peek();
      console.table(
        arr.map((e) => ({
          at: new Date(e.at).toLocaleTimeString(),
          metric: e.metric,
          route: e.route ?? '',
          value: e.value,
          attrs: e.attrs ? JSON.stringify(e.attrs) : '',
        })),
      );
    },
    last() {
      const q = getQ();
      if (!q) return console.warn('ux.last: queue not ready');
      const arr = q.peek();
      const v = arr[arr.length - 1];
      console.log('ux.last =>', v);
      return v;
    },
    clear() {
      const q = getQ();
      if (!q) return console.warn('ux.clear: queue not ready');
      q.clear();
      console.info('ux.clear => cola vacía');
    },
    summary() {
      const q = getQ();
      if (!q) return console.warn('ux.summary: queue not ready');
      const arr = q.peek();

      const by: Record<
        string,
        { count: number; avg_value: number; p95_value: number; min_value: number; max_value: number; _vals: number[] }
      > = {};

      for (const e of arr) {
        const k = e.metric;
        by[k] ??= {count: 0, avg_value: 0, p95_value: 0, min_value: Infinity, max_value: -Infinity, _vals: []};
        const v = Number(e.value ?? 0);
        by[k].count++;
        by[k]._vals.push(v);
        by[k].min_value = Math.min(by[k].min_value, v);
        by[k].max_value = Math.max(by[k].max_value, v);
      }

      for (const k of Object.keys(by)) {
        const vals = by[k]._vals.sort((a, b) => a - b);
        const n = vals.length || 1;
        by[k].avg_value = Math.round(vals.reduce((s, x) => s + x, 0) / n);
        by[k].p95_value = vals[Math.max(0, Math.floor(0.95 * (n - 1)))];
        delete (by[k] as any)._vals;
      }

      console.table(Object.entries(by).map(([metric, r]) => ({metric, ...(r as any)})));
    },
  };
})();

(() => {
  if (typeof window === 'undefined') return;
  const w = window as any;
  if (w.fps_sample) return;

  w.fps_sample = (): Promise<number> =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const tick = (t: number) => {
        frames++;
        if (t - start < 1000) {
          requestAnimationFrame(tick);
        } else {
          const fps = Math.round((frames * 1000) / (t - start));
          resolve(fps);
        }
      };
      requestAnimationFrame(tick);
    });
})();
