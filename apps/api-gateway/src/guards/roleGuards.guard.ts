import { UserModel } from '@app/shared/model/user.model';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as UserModel;
      return roles.includes(user?.roleName);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
