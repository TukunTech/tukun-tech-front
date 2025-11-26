import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface VitalSignUpdate {
  id: number | null;
  patientId: number;
  deviceId: number;
  heartRate: {
    value: number;
    abnormal: boolean;
  };
  oxygenLevel: {
    value: number;
    abnormal: boolean;
  };
  temperature: {
    value: number;
    abnormal: boolean;
  };
  timestamp: string;
  abnormal: boolean;
}

@Injectable({providedIn: 'root'})
export class MonitoringStreamService {
  private readonly baseUrl =
    'https://tukuntech-back.onrender.com/api/v1/monitoring';

  streamUser(userId: number, token: string): Observable<VitalSignUpdate> {
    return new Observable<VitalSignUpdate>((observer) => {
      const controller = new AbortController();
      const url = `${this.baseUrl}/stream/user/${userId}`;

      console.log('Abriendo stream SSE con Bearer token:', url);

      (async () => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'text/event-stream',
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            observer.error(
              new Error(`SSE HTTP error: ${response.status} ${response.statusText}`)
            );
            return;
          }

          if (!response.body) {
            observer.error(new Error('SSE response sin body'));
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const {value, done} = await reader.read();
            if (done) {
              break;
            }

            buffer += decoder.decode(value, {stream: true});

            let idx: number;
            while ((idx = buffer.indexOf('\n\n')) >= 0) {
              const rawEvent = buffer.slice(0, idx).trim();
              buffer = buffer.slice(idx + 2);

              if (!rawEvent) continue;

              let eventType = 'message';
              let data = '';

              for (const line of rawEvent.split('\n')) {
                if (line.startsWith('event:')) {
                  eventType = line.slice(6).trim();
                } else if (line.startsWith('data:')) {
                  const lineData = line.slice(5).trim();
                  data += lineData;
                }
              }

              if (eventType === 'vital-sign-update') {
                try {
                  const parsed = JSON.parse(data) as VitalSignUpdate;
                  observer.next(parsed);
                } catch (e) {
                  console.error('Error parseando vital-sign-update', e, data);
                }
              }

            }
          }

          observer.complete();
        } catch (err: any) {
          if (controller.signal.aborted) {
            return;
          }
          console.error('Error leyendo SSE', err);
          observer.error(err);
        }
      })();

      return () => {
        controller.abort();
      };
    });
  }
}
