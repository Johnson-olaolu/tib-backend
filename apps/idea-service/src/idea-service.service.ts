import { Injectable } from '@nestjs/common';

@Injectable()
export class IdeaServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
