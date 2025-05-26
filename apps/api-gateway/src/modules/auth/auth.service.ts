import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/dto';
import { User } from '@shared/entities';
import { EventPatterns, KafkaClientName, MessagePatterns } from '@shared/enums';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(KafkaClientName.AUTH) private readonly authClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(MessagePatterns.USER_BY_ID);
    this.authClient.subscribeToResponseOf(MessagePatterns.USER_BY_EMAIL);
    await this.authClient.connect();
  }

  createUser(createUserDto: CreateUserDto) {
    this.authClient.emit(EventPatterns.CREATE_USER, createUserDto);
  }

  getUserById(userId: number): Promise<User | null> {
    return firstValueFrom(
      this.authClient.send(MessagePatterns.USER_BY_ID, { userId })
    );
  }

  getUserByEmail(userEmail: string): Promise<User | null> {
    return firstValueFrom(
      this.authClient.send(MessagePatterns.USER_BY_EMAIL, { userEmail })
    );
  }
}
