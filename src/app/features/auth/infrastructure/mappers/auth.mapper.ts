import {Session} from '@feature/auth/domain/entities/session';
import {User} from '@feature/auth/domain/entities/user';

type LoginDTO = {
  accessToken?: string; refreshToken?: string; tokenType?: string; expiresIn?: number;
  user?: {
    id?: string | number;
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    roles?: string[];
    enabled?: boolean;
    active?: boolean;
  };
  data?: any; role?: string | string[];
};

export const toSession = (raw: any): Session => {
  const dto: LoginDTO = (raw?.data ?? raw ?? {}) as LoginDTO;

  const accessToken = dto.accessToken ?? '';
  const refreshToken = dto.refreshToken ?? undefined;
  const tokenType = dto.tokenType ?? 'Bearer';
  const expiresIn = dto.expiresIn;

  const usr = (dto.user ?? {}) as NonNullable<LoginDTO['user']>;

  const username =
    usr.username ??
    usr.email ??
    `${usr.first_name ?? ''} ${usr.last_name ?? ''}`.trim() ??
    '';

  const roles = Array.isArray(usr.roles) ? usr.roles : [];

  const active = (usr.enabled ?? usr.active ?? true) ? true : false;

  const id = usr.id != null ? String(usr.id) : (usr.email ?? '');

  const u = new User(id, username, roles as any, active);
  return new Session(accessToken, refreshToken as any, u, tokenType, expiresIn);
};
