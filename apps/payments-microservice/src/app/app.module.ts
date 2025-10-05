import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaClientName, KafkaConsumerGroup } from '@shared/enums';
import { Partitioners } from 'kafkajs';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId(req, res) {
          const existingID = req.headers['x-request-id'];
          if (existingID) return existingID;
          const id = randomUUID();
          res.setHeader('X-Request-Id', id);
          return id;
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    ClientsModule.register([
      {
        name: KafkaClientName.AUTH_MESSAGES,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payments-microservice-auth-messages',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: `payments-microservice-${
              KafkaConsumerGroup.AUTH
            }-${randomUUID()}`,
          },
          producer: {
            createPartitioner: Partitioners.DefaultPartitioner,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
