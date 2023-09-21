import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UserModel } from '../../../../../libs/shared/src/model/user.model';

const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as UserModel;
      return roles.includes(user.role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
