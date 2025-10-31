import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {map, Observable} from 'rxjs';

export interface CreateSupportTicketRequest {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export interface SupportTicketResponse {
  id: number;
  name: string;
  email: string;
  subject: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({providedIn: 'root'})
export class SupportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/support`;

  createTicket(payload: CreateSupportTicketRequest): Observable<SupportTicketResponse> {
    return this.http
      .post<SupportTicketResponse>(`${this.baseUrl}/tickets`, payload, {observe: 'response'})
      .pipe(map(res => res.body as SupportTicketResponse));
  }
}
