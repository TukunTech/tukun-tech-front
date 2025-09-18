import {MenuItem} from '@layout/sidebar/menu.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'ic_home.png',
    route: '/dashboard',
    exact: true,
    section: 'main',
    roles: ['ADMINISTRATOR', 'ATTENDANT', 'PATIENT']
  },
  {
    id: 'patient',
    label: 'Patient',
    icon: 'ic_patient.png',
    route: '/patient',
    section: 'main',
    roles: ['PATIENT', 'ATTENDANT', 'ADMINISTRATOR']
  },
  {
    id: 'vitals',
    label: 'Vital Sings',
    icon: 'ic_vital_sings.png',
    route: '/vital-signs',
    section: 'main',
    roles: ['PATIENT', 'ATTENDANT', 'ADMINISTRATOR']
  },
  {
    id: 'history',
    label: 'History',
    icon: 'ic_history.png',
    route: '/history',
    section: 'main',
    roles: ['PATIENT', 'ATTENDANT', 'ADMINISTRATOR']
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: 'ic_subscription.png',
    route: '/subscription',
    section: 'footer',
    roles: ['ADMINISTRATOR', 'ATTENDANT', 'PATIENT']
  },
  {
    id: 'support',
    label: 'Support',
    icon: 'ic_support.png',
    route: '/support',
    section: 'footer',
    roles: ['ADMINISTRATOR', 'ATTENDANT', 'PATIENT']
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'ic_logout.png',
    route: '#',
    section: 'footer',
    roles: ['ADMINISTRATOR', 'ATTENDANT', 'PATIENT']
  },
];

