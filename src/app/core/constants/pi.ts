export const API_CONSTANTS = {
  AUTH: {
    CONTROLLER: 'auth',
    LOGIN: 'login',
    REFRESH_TOKEN: 'refresh',
    LOGOUT: 'logout',
    ME: 'me'
  },
  USER: {
    CONTROLLER: 'users',
    LIST: '',
    BY_ID: ':id',
    CREATE: '',
    UPDATE: ':id',
    DELETE: ':id'
  }
} as const;
