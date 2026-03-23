import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AuthModule } from '../modules/auth/auth.module';
import { EventBusModule } from '../modules/event-bus/event-bus.module';
import { PaymentModule } from '../modules/payment/payment.module';

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
    AuthModule,
    PaymentModule,
    EventBusModule,
  ],
})
export class AppModule {}
