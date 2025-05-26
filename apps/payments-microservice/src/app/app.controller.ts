import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { EventPatterns } from '@shared/enums';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern(EventPatterns.PROCESS_PAYMENT)
  async handleProcessPayment(@Payload(ValidationPipe) data: MakePaymentDto) {
    await this.appService.processPayment(data);
  }

  @EventPattern(EventPatterns.PROCESS_PAYMENT)
  async handleProcessPaymentSecondTime(
    @Payload(ValidationPipe) data: MakePaymentDto
  ) {
    this.logger.log('data :>> ', data);
  }
}
