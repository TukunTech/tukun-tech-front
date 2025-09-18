import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Component} from '@angular/core';
import {RegisterFormComponent} from '@feature/auth/ui/components/register-form/register-form.component';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, RouterLink, RegisterFormComponent],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage {}
