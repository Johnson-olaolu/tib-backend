import { PlanPermissionModel } from './plan-permission.model';

export class PlanModel {
  id: string;

  name: string;

  description: string;

  type: string;

  planPermissions: PlanPermissionModel[];

  price: number;

  public createdAt: Date;

  public updatedAt: Date;
}
