import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { EventPatterns, KafkaClientName } from '@shared/enums';
import { EventListener, EventMessage } from '../event-bus/event-bus.decorator';
import type {
  EventPayload,
  EventResponse,
} from '../event-bus/event-bus.interface';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class PaymentService implements OnModuleDestroy {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(KafkaClientName.PAYMENT_EVENTS)
    private readonly paymentEventClient: ClientKafka,
    private readonly eventBusService: EventBusService
  ) {}

  async onModuleDestroy() {
    try {
      await this.paymentEventClient.close();
      this.logger.log('paymentClient disconnected on module destroy');
    } catch (error) {
      this.logger.error('paymentClient error during module destroy', error);
    }
  }

  async makePayment(makePaymentDto: MakePaymentDto) {
    this.paymentEventClient.emit(EventPatterns.PROCESS_PAYMENT, makePaymentDto);
  }

  @EventListener('payment.completed')
  async handlePaymentCompleted(
    payload: EventPayload<'payment.completed'>
  ): EventResponse<'payment.completed'> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(
      `3. payment.completed... Payment completed for user ${payload.userId} with amount ${payload.amount}`
    );
  }

  @EventMessage('payment.make')
  async handleMakePayment(
    payload: EventPayload<'payment.make'>
  ): EventResponse<'payment.make'> {
    this.logger.log(
      `1. payment.make... Processing payment for user ${payload.userId} with amount ${payload.amount}`
    );

    return payload.amount;
  }
}
