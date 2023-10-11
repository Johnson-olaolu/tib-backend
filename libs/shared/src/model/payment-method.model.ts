export class PaymentMethodModel {
  id: string;

  name: string;

  image: string;

  fields: string[];

  disabled: boolean;

  isDefault: boolean;

  public createdAt: Date;

  public updatedAt: Date;
}
