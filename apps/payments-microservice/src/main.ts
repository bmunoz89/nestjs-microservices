import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      logger: new Logger('payments-microservice'),
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'payment-consumer-' + randomUUID(),
        },
        producer: {
          createPartitioner: Partitioners.DefaultPartitioner,
        },
      },
    }
  );
  await app.listen();
}

void bootstrap();
