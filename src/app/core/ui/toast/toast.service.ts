import {Injectable, signal} from '@angular/core';

export type ToastKind = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
  timeout: number;
}

@Injectable({providedIn: 'root'})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();
  private _id = 0;

  show(kind: ToastKind, text: string, timeout = 3000) {
    const t: Toast = {id: ++this._id, kind, text, timeout};
    this._toasts.update(list => [...list, t]);
    setTimeout(() => this.dismiss(t.id), timeout);
  }

  success(text: string, timeout = 3000) {
    this.show('success', text, timeout);
  }

  warning(text: string, timeout = 3000) {
    this.show('warning', text, timeout);
  }

  error(text: string, timeout = 3000) {
    this.show('error', text, timeout);
  }

  info(text: string, timeout = 3000) {
    this.show('info', text, timeout);
  }

  dismiss(id: number) {
    this._toasts.update(list => list.filter(x => x.id !== id));
  }
}
