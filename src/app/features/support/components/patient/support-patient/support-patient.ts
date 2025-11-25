import {Component, computed, inject, signal, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CreateSupportTicketRequest,
  SupportService,
  SupportTicketResponse
} from '@feature/support/services/support.service';

@Component({
  selector: 'app-support-patient',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './support-patient.html',
  styleUrl: './support-patient.css'
})
export class SupportPatient implements OnInit {
  private readonly support = inject(SupportService);

  // ===== Form =====
  readonly form = signal<CreateSupportTicketRequest>({
    name: '',
    email: '',
    subject: '',
    description: '',
  });

  readonly loading = signal(false);

  readonly canSubmit = computed(() => {
    const value = this.form();
    return Boolean(
      value.email?.trim() &&
      value.name?.trim() &&
      value.subject?.trim() &&
      value.description?.trim()
    );
  });

  tickets: SupportTicketResponse[] = [];
  readonly ticketsLoading = signal(false);

  ngOnInit(): void {
    this.loadTickets();
  }

  update(field: keyof CreateSupportTicketRequest, value: string): void {
    this.form.update(current => ({
      ...current,
      [field]: value,
    }));
  }

  ticketAnswer(ticket: SupportTicketResponse): string {
    const responses = ticket.responses ?? [];
    if (!responses.length) {
      return 'Waiting for response...';
    }

    const last = responses[responses.length - 1] as { description?: string; message?: string };
    return last.description || last.message || 'Waiting for response...';
  }

  private loadTickets(): void {
    this.ticketsLoading.set(true);

    this.support.getMyTickets().subscribe({
      next: tickets => {
        this.tickets = tickets;
        this.ticketsLoading.set(false);
      },
      error: () => {
        this.ticketsLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.loading.set(true);
    const payload = this.form();

    this.support.createTicket(payload).subscribe({
      next: () => {
        this.form.set({name: '', email: '', subject: '', description: ''});
        this.loading.set(false);
        this.loadTickets();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
