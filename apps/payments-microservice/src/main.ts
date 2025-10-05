import { LoggerMicroserviceInterceptor } from '@libs/logger-microservice';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaConsumerGroup } from '@shared/enums';
import { Partitioners } from 'kafkajs';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      bufferLogs: true,
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: KafkaConsumerGroup.PAYMENT,
        },
        producer: {
          createPartitioner: Partitioners.DefaultPartitioner,
        },
      },
    }
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new LoggerMicroserviceInterceptor()
  );
  await app.listen();
}

void bootstrap();
