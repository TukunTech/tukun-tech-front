import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastService} from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
})
export class ToastContainerComponent {
  private svc = inject(ToastService);
  toasts = this.svc.toasts;

  close(id: number) {
    this.svc.dismiss(id);
  }
}
