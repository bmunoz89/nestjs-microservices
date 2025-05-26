import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { PaymentModule } from '../modules/payment/payment.module';

@Module({
  imports: [AuthModule, PaymentModule],
})
export class AppModule {}
