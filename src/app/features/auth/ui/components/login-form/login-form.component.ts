import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  @Output() submitCredentials = new EventEmitter<{ username: string; password: string }>();
  loading = false;
  error = '';
  form = new FormBuilder().group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  setLoading(v: boolean) {
    this.loading = v;
  }

  setError(m: string) {
    this.error = m;
  }

  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.submitCredentials.emit(this.form.getRawValue() as any);
  }
}
