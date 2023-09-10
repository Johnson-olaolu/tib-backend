import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlanPermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
