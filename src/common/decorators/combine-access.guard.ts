import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const COMBINE_ACCESS_KEY = 'combineAccess';

@Injectable()
export class CombineAccessGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            COMBINE_ACCESS_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) return true;
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
}
