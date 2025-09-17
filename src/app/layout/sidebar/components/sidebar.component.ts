import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthFacade} from '@feature/auth/application/auth.facade';
import {Role} from '@feature/auth/domain/entities/user';
import {MenuItem} from '@layout/sidebar/menu.model';
import {MENU_ITEMS} from '@layout/sidebar/menu.config';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private auth = inject(AuthFacade);

  isCollapsed = signal(false);
  private roleSet = computed(() => new Set<Role>(this.auth.user()?.roles ?? []));

  private filtered = computed<MenuItem[]>(() =>
    MENU_ITEMS.filter(i => i.roles.some(r => this.roleSet().has(r)))
  );

  itemsMain = computed(() => this.filtered().filter(i => i.section === 'main'));
  itemsFooter = computed(() => this.filtered().filter(i => i.section === 'footer'));

  toggle() { this.isCollapsed.update(v => !v); }
}
