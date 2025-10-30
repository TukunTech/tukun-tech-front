import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  Registration,
  Role
} from '@feature/auth/domain/entities/registration';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {Router} from '@angular/router';
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

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required],
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

