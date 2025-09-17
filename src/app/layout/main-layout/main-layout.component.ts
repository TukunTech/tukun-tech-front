import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {}
