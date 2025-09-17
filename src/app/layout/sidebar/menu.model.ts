import {Role} from '@feature/auth/domain/entities/user';

export type MenuSection = 'main' | 'footer';

export type MenuItem = {
  id: string;
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
  section: MenuSection;
  roles: Role[];
};
