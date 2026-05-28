import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //inyectamos Reflector para poder obtener la metada agregada con @SetMetadata en el controller
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Obtenemos los roles requeridos
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    // 2. Estraemos el usuario (inyectado previamente por AuthGuard)
    const request = context.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    // Si estás usando @Auth(), AuthGuard ya debió validar el token,
    // pero esto es un excelente salvavidas por si alguien usa este guard solo
    if (!user) throw new BadRequestException('User not found');

    // 3. SI NO SE ESPECIFICARON ROLES: El endpoint es "público" respecto a roles,
    // pero ya comprobamos que está autenticado
    if (!validRoles || validRoles.length === 0) return true;

    // 4. SI HAY ROLES: Verificamos que el usuario tenga al menos uno
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      'You do not have the necessary privileges to access this resource',
    );
  }
}
