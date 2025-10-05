import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { EventPatterns, KafkaClientName } from '@shared/enums';

@Injectable()
export class PaymentService implements OnModuleDestroy {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(KafkaClientName.PAYMENT_EVENTS)
    private readonly paymentEventClient: ClientKafka
  ) {}

  async onModuleDestroy() {
    try {
      await this.paymentEventClient.close();
      this.logger.log('paymentClient disconnected on module destroy');
    } catch (error) {
      this.logger.error('paymentClient error during module destroy', error);
    }
  }

  makePayment(makePaymentDto: MakePaymentDto) {
    this.paymentEventClient.emit(EventPatterns.PROCESS_PAYMENT, makePaymentDto);
  }
}
