import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Microservices } from '@shared/constants';
import { MakePaymentDto } from '@shared/dto';
import { User } from '@shared/entities';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(Microservices.auth) private readonly authClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user_by_id');
    await this.authClient.connect();
  }

  async processPayment(makePaymentDto: MakePaymentDto) {
    const { userId, amount } = makePaymentDto;
    console.log('process payment');
    const user: User | null = await firstValueFrom(
      this.authClient.send('get_user_by_id', JSON.stringify({ userId }))
    );
    if (!user) {
      console.log(`user id '${userId}' does not exists`);
      return;
    }
    console.log(`process payment for user ${user.name} - amount: ${amount}`);
  }
}
