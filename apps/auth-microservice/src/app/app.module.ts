import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { UserModule } from '../modules/user/user.module';

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
    UserModule,
  ],
})
export class AppModule {}
