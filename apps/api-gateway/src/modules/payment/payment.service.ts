import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { EventPatterns, KafkaClientName } from '@shared/enums';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(KafkaClientName.PAYMENT) private readonly paymentClient: ClientKafka
  ) {}

  makePayment(makePaymentDto: MakePaymentDto) {
    this.paymentClient.emit(EventPatterns.PROCESS_PAYMENT, makePaymentDto);
  }
}
