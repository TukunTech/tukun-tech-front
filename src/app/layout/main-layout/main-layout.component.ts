import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {SidebarComponent} from '@layout/sidebar/components/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {}
