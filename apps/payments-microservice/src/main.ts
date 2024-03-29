import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:29092'],
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
