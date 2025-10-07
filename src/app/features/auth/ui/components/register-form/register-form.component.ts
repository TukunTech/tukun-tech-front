import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  ALLERGIES,
  BLOOD_GROUPS,
  GENDERS,
  NATIONALITIES,
  Registration,
  Role
} from '@feature/auth/domain/entities/registration';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {Router, RouterLink} from '@angular/router';
import {ToastService} from '@core/ui/toast/toast.service';
import {ToastContainerComponent} from '@core/ui/toast/components/toast-container.component';

@Component({
  standalone: true,
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule, ToastContainerComponent],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);
  private facade = inject(AuthFacade);
  private router = inject(Router);
  private toast = inject(ToastService);

  roles: Role[] = ['PATIENT', 'ATTENDANT'];
  genders = GENDERS;
  bloodGroups = BLOOD_GROUPS;
  nationalities = NATIONALITIES;
  allergies = ALLERGIES;

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],  // antes "name"
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8,12}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/) // 1 letra + 1 número
    ]],
    role: ['PATIENT', [Validators.required]],

    gender: [null, [Validators.required]],          // antes "sex"
    age: [null, [Validators.required, Validators.min(0), Validators.max(130)]],
    bloodGroup: [null, [Validators.required]],
    nationality: [null, [Validators.required]],
    allergy: [null, [Validators.required]],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Data is missing or some fields are invalid');
      return;
    }

    try {
      const reg = Registration.fromForm(this.form.value);
      const s = await this.facade.register(reg);

      this.toast.success('Registration created successfully');

      if (s.accessToken) {
        const home = this.facade.getHomeByRole();
        await this.router.navigateByUrl(home);
      } else {
        await this.router.navigateByUrl('/auth/login');
      }
    } catch (e: any) {
      console.error(e);
      this.toast.error(e?.message || 'We were unable to complete the registration');
    }
  }
}
