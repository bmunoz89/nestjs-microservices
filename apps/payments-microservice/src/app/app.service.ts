import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@shared/dto';
import { User } from '@shared/entities';
import { KafkaClientName, MessagePatterns } from '@shared/enums';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(KafkaClientName.AUTH_MESSAGES)
    private readonly authMessageClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authMessageClient.subscribeToResponseOf(MessagePatterns.USER_BY_ID);
    await this.authMessageClient.connect();
  }

  async onModuleDestroy() {
    try {
      await this.authMessageClient.close();
      this.logger.log('authMessageClient disconnected on module destroy');
    } catch (error) {
      this.logger.error('authMessageClient error during module destroy', error);
    }
  }

  async processPayment(makePaymentDto: MakePaymentDto) {
    const { userId, amount } = makePaymentDto;
    const user: User | null = await firstValueFrom(
      this.authMessageClient.send(MessagePatterns.USER_BY_ID, { userId })
    );
    if (user)
      this.logger.log(
        `process payment for user ${user.name} - amount: ${amount}`
      );
    else this.logger.log(`user id '${userId}' does not exists`);
  }
}
