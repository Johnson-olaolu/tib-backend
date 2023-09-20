import { Controller } from '@nestjs/common';
import { PaystackService } from './paystack.service';

@Controller()
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}
}
