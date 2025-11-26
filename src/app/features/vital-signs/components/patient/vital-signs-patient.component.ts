import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForOf} from '@angular/common';
import {interval, Subscription} from 'rxjs';
import {MonitoringStreamService, VitalSignUpdate} from '@feature/vital-signs/services/monitoring-stream.service';

type AlertLevel = 'mid' | 'high';
type AlertType =
  | 'low_spo2'
  | 'tachycardia'
  | 'bradycardia'
  | 'high_temp'
  | 'low_temp';

type AlertItem = { icon: string; label: string; time: string; level?: AlertLevel };

@Component({
  standalone: true,
  selector: 'app-patient-vital-signs',
  imports: [NgForOf],
  templateUrl: './vital-signs-patient.component.html',
  styleUrls: ['./vital-signs-patient.component.css']
})
export class VitalSignsPatientComponent implements OnInit, OnDestroy {

  latestAlerts: AlertItem[] = [];

  hasData = false;

  mode: 'normal' | 'danger' | 'emergency' = 'normal';
  private ranges = {
    normal: {
      bpm: [72, 95] as [number, number],
      spo2: [94, 99] as [number, number],
      temp: [36.0, 37.2] as [number, number]
    },
    danger: {
      bpm: [95, 120] as [number, number],
      spo2: [88, 94] as [number, number],
      temp: [35.5, 38.5] as [number, number]
    },
    emergency: {
      bpm: [40, 150] as [number, number],
      spo2: [75, 90] as [number, number],
      temp: [34.0, 40.0] as [number, number]
    }
  };

  bpm: number | null = null;
  spo2: number | null = null;
  temperature: number | null = null;

  private bpmTarget = 0;
  private spo2Target = 0;
  private tempTarget = 0;

  private W = 120;
  private H = 28;
  private N = 120;
  private bpmBuf = Array(this.N).fill(this.H / 2);
  private spo2Buf = Array(this.N).fill(this.H / 2);

  bpmPolyline = this.toPoints(this.bpmBuf);
  spo2Polyline = this.toPoints(this.spo2Buf);

  private subAnim?: Subscription;
  private subSlow?: Subscription;

  private tickMs = 40;
  private slowMs = 1500;

  private phase = 0;

  private TH = {
    spo2: {danger: 92, emergency: 88},
    tachy: {danger: 110, emergency: 140},
    brady: {danger: 60, emergency: 50},
    tempHigh: {danger: 38.0, emergency: 39.0},
    tempLow: {emergency: 35.0}
  } as const;

  private lastByType: Record<AlertType, { level: AlertLevel | null; value: number | null }> = {
    low_spo2: {level: null, value: null},
    tachycardia: {level: null, value: null},
    bradycardia: {level: null, value: null},
    high_temp: {level: null, value: null},
    low_temp: {level: null, value: null}
  };

  private deltas = {
    low_spo2: 1,
    tachycardia: 5,
    bradycardia: 5,
    high_temp: 0.3,
    low_temp: 0.3
  } as const;

  private maxAlerts = 3;

  constructor(private monitoringStream: MonitoringStreamService) {
  }

  ngOnInit() {
    this.subAnim = interval(this.tickMs).subscribe(() => {
      const periodSec = 60 / Math.max(40, this.bpmTarget || 0);
      const dPhase = (this.tickMs / 1000) / periodSec;
      this.phase = (this.phase + dPhase) % 1;

      const ecg = this.ecgPQRST(this.phase);
      const yBpm = this.mapToSvgY(0.55 * ecg);
      this.shiftPush(this.bpmBuf, yBpm);
      this.bpmPolyline = this.toPoints(this.bpmBuf);

      const resp = Math.sin(2 * Math.PI * (this.phase * 0.25));
      const ySpo2 = this.mapToSvgY(0.20 * resp);
      this.shiftPush(this.spo2Buf, ySpo2);
      this.spo2Polyline = this.toPoints(this.spo2Buf);
    });

    const accessToken = localStorage.getItem('tt_access_token') ?? '';
    const userRaw = localStorage.getItem('tt_user');

    let userId: number | null = null;
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        userId = Number(user.id);
      } catch (e) {
        console.error('Error parseando tt_user desde localStorage', e, userRaw);
      }
    }

    console.log('ACCESS TOKEN (tt_access_token):', accessToken);
    console.log('USER ID (tt_user.id):', userId);

    if (!accessToken || !userId) {
      console.error('No hay token o userId válido, no se abre el stream');
      return;
    }

    this.subSlow = this.monitoringStream
      .streamUser(userId, accessToken)
      .subscribe({
        next: (v: VitalSignUpdate) => {
          this.hasData = true;

          this.bpmTarget = v.heartRate.value;
          this.spo2Target = v.oxygenLevel.value;
          this.tempTarget = v.temperature.value;

          this.bpm = Math.round(this.bpmTarget);
          this.spo2 = Math.round(this.spo2Target);
          this.temperature = +this.tempTarget.toFixed(1);

          this.checkAlertsOnChange();
        },
        error: (err) => {
          console.error('Error en stream de signos vitales', err);
        }
      });
  }

  ngOnDestroy() {
    this.subAnim?.unsubscribe();
    this.subSlow?.unsubscribe();
  }

  changeMode(newMode: 'normal' | 'danger' | 'emergency') {
    this.mode = newMode;
  }

  private checkAlertsOnChange() {
    if (this.bpm === null || this.spo2 === null || this.temperature === null) {
      return;
    }

    const now = new Date();

    let spo2Level: AlertLevel | null = null;
    if (this.spo2 <= this.TH.spo2.emergency) spo2Level = 'high';
    else if (this.spo2 <= this.TH.spo2.danger) spo2Level = 'mid';

    this.maybeAddOnChange(
      'low_spo2',
      spo2Level,
      this.spo2,
      `Low oxygenation (SpO₂ ${this.spo2}%)`,
      now
    );

    let tachyLevel: AlertLevel | null = null;
    if (this.bpm >= this.TH.tachy.emergency) tachyLevel = 'high';
    else if (this.bpm >= this.TH.tachy.danger) tachyLevel = 'mid';

    this.maybeAddOnChange(
      'tachycardia',
      tachyLevel,
      this.bpm,
      `Accelerated heart rate (${this.bpm} bpm)`,
      now
    );

    let bradyLevel: AlertLevel | null = null;
    if (this.bpm <= this.TH.brady.emergency) bradyLevel = 'high';
    else if (this.bpm <= this.TH.brady.danger) bradyLevel = 'mid';

    this.maybeAddOnChange(
      'bradycardia',
      bradyLevel,
      this.bpm,
      `Low heart rate (${this.bpm} bpm)`,
      now
    );

    let highTempLevel: AlertLevel | null = null;
    if (this.temperature >= this.TH.tempHigh.emergency) highTempLevel = 'high';
    else if (this.temperature >= this.TH.tempHigh.danger) highTempLevel = 'mid';

    this.maybeAddOnChange(
      'high_temp',
      highTempLevel,
      this.temperature,
      `High temperature (${this.temperature.toFixed(1)}°C)`,
      now
    );

    let lowTempLevel: AlertLevel | null = null;
    if (this.temperature <= this.TH.tempLow.emergency) lowTempLevel = 'high';

    this.maybeAddOnChange(
      'low_temp',
      lowTempLevel,
      this.temperature,
      `Low temperature (${this.temperature.toFixed(1)}°C)`,
      now
    );
  }

  private maybeAddOnChange(
    type: AlertType,
    level: AlertLevel | null,
    value: number,
    label: string,
    now: Date
  ) {
    const state = this.lastByType[type];
    if (level === null) {
      state.level = null;
      state.value = null;
      return;
    }

    const deltaMin = this.deltas[type];
    const changedLevel = state.level !== level;
    const changedValue =
      state.value === null ? true : Math.abs(value - state.value) >= deltaMin;

    if (changedLevel || changedValue) {
      this.latestAlerts.unshift({
        icon: '/ic_warning_home.png',
        label,
        time: this.hhmm(now),
        level
      });
      if (this.latestAlerts.length > this.maxAlerts) this.latestAlerts.pop();

      state.level = level;
      state.value = value;
    } else {
      state.value = value;
    }
  }

  private hhmm(d: Date) {
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  private shiftPush(buf: number[], y: number) {
    buf.push(y);
    if (buf.length > this.N) buf.shift();
  }

  private mapToSvgY(v: number) {
    const t = (v + 1) / 2;
    return (1 - t) * (this.H - 2) + 1;
  }

  private toPoints(buf: number[]) {
    const stepX = this.W / (this.N - 1);
    return buf.map((y, i) => `${(i * stepX).toFixed(2)},${y.toFixed(2)}`).join(',');
  }

  private rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  private ecgPQRST(f: number): number {
    const p = 0.18, q = 0.40, r = 0.45, s = 0.50, t = 0.72;
    const Ap = 0.25, Aq = -0.35, Ar = 1.6, As = -0.6, At = 0.35;
    const Sp = 0.015, Sq = 0.010, Sr = 0.008, Ss = 0.012, St = 0.04;

    const g = (x: number, mu: number, sigma: number) => {
      const d = this.minWrapDist(x, mu);
      return Math.exp(-(d * d) / (2 * sigma * sigma));
    };

    const baseline = 0.02 * Math.sin(2 * Math.PI * (f * 1.2));
    return (
      Ap * g(f, p, Sp) +
      Aq * g(f, q, Sq) +
      Ar * g(f, r, Sr) +
      As * g(f, s, Ss) +
      At * g(f, t, St) +
      baseline
    );
  }

  private minWrapDist(x: number, mu: number) {
    let d = x - mu;
    if (d > 0.5) d -= 1;
    if (d < -0.5) d += 1;
    return d;
  }
}
