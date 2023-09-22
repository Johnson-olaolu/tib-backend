import { Controller } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';

@Controller()
export class EmailNotificationController {
  constructor(
    private readonly emailNotificationService: EmailNotificationService,
  ) {}
}
