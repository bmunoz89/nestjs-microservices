import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/dto';
import { User } from '@shared/entities';
import { EventPatterns, KafkaClientName, MessagePatterns } from '@shared/enums';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(KafkaClientName.AUTH_MESSAGES)
    private readonly authMessageClient: ClientKafka,
    @Inject(KafkaClientName.AUTH_EVENTS)
    private readonly authEventClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authMessageClient.subscribeToResponseOf(MessagePatterns.USER_BY_ID);
    this.authMessageClient.subscribeToResponseOf(MessagePatterns.USER_BY_EMAIL);
    await this.authMessageClient.connect();
  }

  async onModuleDestroy() {
    try {
      await this.authMessageClient.close();
      this.logger.log('authMessageClient disconnected on module destroy');
    } catch (error) {
      this.logger.error('authMessageClient error during module destroy', error);
    }

    try {
      await this.authEventClient.close();
      this.logger.log('authEventClient disconnected on module destroy');
    } catch (error) {
      this.logger.error('authEventClient error during module destroy', error);
    }
  }

  createUser(createUserDto: CreateUserDto) {
    this.authEventClient.emit(EventPatterns.CREATE_USER, createUserDto);
  }

  getUserById(userId: number): Promise<User | null> {
    return firstValueFrom(
      this.authMessageClient.send(MessagePatterns.USER_BY_ID, { userId })
    );
  }

  getUserByEmail(userEmail: string): Promise<User | null> {
    return firstValueFrom(
      this.authMessageClient.send(MessagePatterns.USER_BY_EMAIL, { userEmail })
    );
  }
}
