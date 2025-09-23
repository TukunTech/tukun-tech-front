import {getUrlFactory} from '@core/utils/url-helpers';
import {API_CONSTANTS} from '@core/constants/pi';

const build = getUrlFactory('AUTH' as any);

export const AUTH_API = {
  LOGIN: build(API_CONSTANTS.AUTH.LOGIN),
  REFRESH: build(API_CONSTANTS.AUTH.REFRESH_TOKEN),
  LOGOUT: build(API_CONSTANTS.AUTH.LOGOUT),
  ME: build(API_CONSTANTS.AUTH.ME),
  REGISTER: build(API_CONSTANTS.AUTH.REGISTER),
} as const;
