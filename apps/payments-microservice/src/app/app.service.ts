import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { User } from '@shared/entities';
import { KafkaClientName, MessagePatterns } from '@shared/enums';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(KafkaClientName.AUTH) private readonly authClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(MessagePatterns.USER_BY_ID);
    await this.authClient.connect();
  }

  async processPayment(makePaymentDto: MakePaymentDto) {
    const { userId, amount } = makePaymentDto;
    this.logger.log('process payment');
    const user: User | null = await firstValueFrom(
      this.authClient.send(MessagePatterns.USER_BY_ID, { userId })
    );
    if (!user) {
      this.logger.log(`user id '${userId}' does not exists`);
      return;
    }
    this.logger.log(
      `process payment for user ${user.name} - amount: ${amount}`
    );
  }
}
