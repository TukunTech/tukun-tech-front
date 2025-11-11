import {
  Injectable,
  ApplicationRef,
  APP_INITIALIZER,
  Provider,
  inject,
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event as RouterEvent,
} from '@angular/router';
import {filter, take} from 'rxjs/operators';
import {firstValueFrom} from 'rxjs';
import {markRouteStart, markRouteDone, startFpsMonitor} from './ux-metrics';

@Injectable({providedIn: 'root'})
export class UxRouterMetrics {
  private stopFps?: () => void;
  private pendingRoute?: string;

  constructor(private router: Router, private appRef: ApplicationRef) {
    this.stopFps = startFpsMonitor(() => location.pathname);

    this.router.events
      .pipe(
        filter(
          (e: RouterEvent) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
      )
      .subscribe(async (e) => {
        if (e instanceof NavigationStart) {
          const path = this.extractPath(e.url);
          this.pendingRoute = path;
          markRouteStart(path);
          return;
        }

        if (e instanceof NavigationEnd) {
          const path = this.extractPath(e.urlAfterRedirects || e.url);
          await firstValueFrom(this.appRef.isStable.pipe(filter(Boolean), take(1)));
          await new Promise<void>((r) => requestAnimationFrame(() => r()));
          markRouteDone(path);
          this.pendingRoute = undefined;
          return;
        }

        if (e instanceof NavigationCancel || e instanceof NavigationError) {
          if (this.pendingRoute) {
            markRouteDone(this.pendingRoute);
            this.pendingRoute = undefined;
          }
        }
      });
  }

  private extractPath(url: string): string {
    try {
      const u = new URL(url, location.origin);
      return u.pathname || '/';
    } catch {
      return (url.split('?')[0].split('#')[0] || '/').trim();
    }
  }
}


export function provideRouterUx(): Provider[] {
  return [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        inject(UxRouterMetrics);
        return () => Promise.resolve();
      },
    },
  ];
}
