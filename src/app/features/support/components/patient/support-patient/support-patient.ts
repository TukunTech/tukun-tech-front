import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateSupportTicketRequest, SupportService} from '@feature/support/services/support.service';

@Component({
  selector: 'app-support-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-patient.html',
  styleUrl: './support-patient.css'
})
export class SupportPatient {
  private readonly support = inject(SupportService);

  readonly form = signal<CreateSupportTicketRequest>({
    name: '',
    email: '',
    subject: '',
    description: '',
  });

  tickets = [
    {
      subject: 'Problema con el dispositivo',
      status: 'OPEN',
      answer: null
    },
    {
      subject: 'No veo mis datos',
      status: 'IN_PROGRESS',
      answer: null
    },
    {
      subject: 'Error en reporte mensual',
      status: 'RESOLVED',
      answer: 'Ya se corrigió el cálculo de tus reportes.'
    },
    {
      subject: 'Cambio de plan',
      status: 'CLOSED',
      answer: 'Ticket cerrado. Si el problema continúa, abre uno nuevo.'
    }
  ];



  readonly loading = signal(false);

  update<K extends keyof CreateSupportTicketRequest>(key: K, value: CreateSupportTicketRequest[K]) {
    this.form.update(curr => ({...curr, [key]: value}));
  }

  private emailOk(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  readonly canSubmit = computed(() => {
    const f = this.form();
    return !!f.name && !!f.subject && !!f.description && this.emailOk(f.email);
  });

  onSubmit() {
    if (!this.canSubmit() || this.loading()) return;

    this.loading.set(true);
    const payload = this.form();

    this.support.createTicket(payload).subscribe({
      next: () => {
        this.form.set({name: '', email: '', subject: '', description: ''});
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
