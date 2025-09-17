import {API_CONSTANTS} from '@core/constants/pi';

export function getUrlFactory<T extends keyof typeof API_CONTROLLERS>(controller: T) {
  const base = API_CONTROLLERS[controller];
  return (endpoint: string, params?: Record<string, string | number>) => {
    let path = `/${base}/${endpoint}`;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        path = path.replace(`:${k}`, String(v));
      });
    }
    return path.replace(/\/+$/, '');
  };
}

const API_CONTROLLERS = Object.fromEntries(
  Object.entries(API_CONSTANTS).map(([k, v]: any) => [k, v.CONTROLLER])
) as Record<string, string>;
