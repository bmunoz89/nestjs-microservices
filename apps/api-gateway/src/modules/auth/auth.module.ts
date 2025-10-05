import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaClientName, KafkaConsumerGroup } from '@shared/enums';
import { Partitioners } from 'kafkajs';
import { randomUUID } from 'node:crypto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KafkaClientName.AUTH_MESSAGES,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway-auth-messages',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: `api-gateway-${KafkaConsumerGroup.AUTH}-${randomUUID()}`,
          },
          producer: {
            createPartitioner: Partitioners.DefaultPartitioner,
          },
        },
      },
      {
        name: KafkaClientName.AUTH_EVENTS,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway-auth-events',
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
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
