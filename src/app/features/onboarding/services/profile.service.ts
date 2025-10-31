import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {PatientProfile} from '@feature/onboarding/models/profile.model';
import {environment} from '@env/environment';


@Injectable({providedIn: 'root'})
export class ProfileService {
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient) {
  }

  getMyProfile() {
    return this.http.get<PatientProfile>(`${this.baseUrl}/me`, {observe: 'response'}).pipe(
      map(res => res.body ?? null),
      catchError(err => {
        if (err.status === 404) return of(null);
        if (err.status === 500 && typeof err.error?.message === 'string' &&
          err.error.message.includes('Profile not found')) return of(null);
        throw err;
      })
    );
  }

  createProfile(payload: Omit<PatientProfile, 'id' | 'userId'>) {
    return this.http.post<PatientProfile>(this.baseUrl, payload);
  }

  updateMyProfile(payload: UpdateMyProfileRequest): Observable<PatientProfile> {
    return this.http.put<PatientProfile>(`${this.baseUrl}/me`, payload).pipe(
      map(res => res)
    );
  }
}

export type UpdateMyProfileRequest = {
  firstName: string;
  lastName: string;
  dni: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | string;
  bloodGroup: 'O_POSITIVE' | 'A_POSITIVE' | string;
  nationality: 'PERUVIAN' | string;
  allergy: 'PENICILLIN' | string;
};
