export const API_CONSTANTS = {
  AUTH: {
    CONTROLLER: 'auth',
    LOGIN: 'login',
    REFRESH_TOKEN: 'refresh',
    LOGOUT: 'logout',
    ME: 'me',
    REGISTER: 'register',
    ROLES: 'roles'
  },

  USER: {
    CONTROLLER: 'users',
    LIST: '',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id'
  },

  IAM_TEST: {
    CONTROLLER: 'iam/test',
    ME: 'me',
    ADMIN_PING: 'admin/ping',
    ATTENDANT_PING: 'attendant/ping',
    PATIENT_PING: 'patient/ping'
  },

  REPORTS: {
    CONTROLLER: 'reports',
    GENERATE: 'generate/:userId',
    ME_DAILY: 'me/daily',
    ME_ALERTS: 'me/alerts'
  },

  MONITORING: {
    CONTROLLER: 'monitoring',
    MEASUREMENTS: 'measurements',
    MEASUREMENT_BY_ID: 'measurements/:id',
    RECENT_MEASUREMENTS: 'measurements/recent',
    STREAM_USER: 'stream/user/:userId',
    PATIENT_MEASUREMENTS: 'patients/:id/measurements',
    PATIENT_ALERTS: 'patients/:id/alerts'
  },

  CARE: {
    CONTROLLER: 'care',
    ASSIGN: 'assign',
    MY_PATIENTS: 'my-patients',
    MY_CAREGIVERS: 'my-caregivers',
    UNASSIGN: 'unassign/:userId'
  },

  PROFILES: {
    CONTROLLER: 'profiles',
    ME: 'me',
    UPDATE_ME: 'me',
    CREATE: '',
    BY_ID: ':id',
    PATIENTS: 'patients',
    PATIENTS_SEARCH: 'patients/search',
    ATTENDANTS: 'attendants',
    ATTENDANTS_SEARCH: 'attendants/search',
    BY_DNI: 'dni/:dni',
    DELETE_BY_DNI: 'dni/:dni'
  },

  SUPPORT: {
    CONTROLLER: 'support',
    TICKETS: 'tickets',
    MY_TICKETS: 'my-tickets',
    CREATE_TICKET: 'tickets',
    ADD_RESPONSE: 'tickets/:ticketId/responses',
    UPDATE_STATUS: 'tickets/:ticketId/status'
  }
} as const;
