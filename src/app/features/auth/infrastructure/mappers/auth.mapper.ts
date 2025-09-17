import {Session} from '@feature/auth/domain/entities/session';
import {User} from '@feature/auth/domain/entities/user';

type LoginDTO = {
  accessToken: string; refreshToken: string; tokenType?: string; expiresIn?: number;
  user: { id: string | number; username?: string; email?: string; roles: string[]; active?: boolean; };
};

export const toSession = (raw: any): Session => {
  const dto: LoginDTO = raw?.data ?? raw; // soporta ambas
  const username = dto.user.username ?? dto.user.email ?? '';
  const u = new User(String(dto.user.id), username, dto.user.roles as any, dto.user.active ?? true);
  return new Session(dto.accessToken, dto.refreshToken, u, dto.tokenType ?? 'Bearer', dto.expiresIn);
};

