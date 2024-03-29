import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { PaymentModule } from '../modules/payment/payment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
