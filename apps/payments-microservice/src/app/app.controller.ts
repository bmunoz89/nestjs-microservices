import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('process_payment')
  async handleProcessPayment(@Payload(ValidationPipe) data: MakePaymentDto) {
    await this.appService.processPayment(data);
  }
}
