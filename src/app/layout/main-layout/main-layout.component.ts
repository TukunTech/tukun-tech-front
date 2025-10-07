import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {SidebarComponent} from '@layout/sidebar/components/sidebar.component';
import {ToastContainerComponent} from '@core/ui/toast/components/toast-container.component';
import {ToastService} from '@core/ui/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  constructor(public toast: ToastService) {}
}
