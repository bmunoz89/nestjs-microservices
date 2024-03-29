import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Microservices } from '@shared/constants';
import { MakePaymentDto } from '@shared/dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(Microservices.payment) private readonly paymentClient: ClientKafka
  ) {}

  makePayment(makePaymentDto: MakePaymentDto) {
    this.paymentClient.emit('process_payment', JSON.stringify(makePaymentDto));
  }
}
