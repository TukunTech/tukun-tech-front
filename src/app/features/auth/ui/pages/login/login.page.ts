import {Router} from '@angular/router';
import {Component, inject, ViewChild} from '@angular/core';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {LoginFormComponent} from '@feature/auth/ui/components/login-form/login-form.component';
import {CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  @ViewChild('formRef') form!: LoginFormComponent;

  private facade = inject(AuthFacade);
  private router = inject(Router);

  async onLogin({username, password}: { username: string; password: string }): Promise<void> {
    this.form.setLoading(true);
    this.form.setError('');

    try {
      const session = await this.facade.login(username, password);

      // decide destino por rol
      let target: string | null = null;
      const roles = new Set(session.user.roles);
      if (roles.has('ADMINISTRATOR')) target = '/dashboard/admin';
      else if (roles.has('ATTENDANT')) target = '/dashboard/attendant';
      else if (roles.has('PATIENT')) target = '/dashboard/patient';

      if (target) {
        await this.router.navigateByUrl(target);
      } else {
        this.form.setError('No tiene un rol válido asignado.');
      }

      // no retornamos ningún valor explícito → Promise<void>
    } catch (e: any) {
      // muchos backends devuelven {message}, {error: {message}}, {errors: [...]}
      const msg = e?.error?.message || e?.error?.error || e?.message || 'Credenciales inválidas';
      this.form.setError(msg);
    } finally {
      this.form.setLoading(false);
    }
  }
}
