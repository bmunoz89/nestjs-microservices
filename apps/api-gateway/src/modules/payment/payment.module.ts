import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaClientName } from '@shared/enums';
import { Partitioners } from 'kafkajs';
import { EventBusModule } from '../event-bus/event-bus.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KafkaClientName.PAYMENT_EVENTS,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway-payment-events',
            brokers: ['localhost:9092'],
          },
          producer: {
            createPartitioner: Partitioners.DefaultPartitioner,
          },
          // Feature flag to skip consumer group registration and only act as a producer
          producerOnlyMode: true,
        },
      },
    ]),
    EventBusModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
