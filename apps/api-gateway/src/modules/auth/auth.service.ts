import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Microservices } from '@shared/constants';
import { CreateUserDto } from '@shared/dto';
import { User } from '@shared/entities';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(Microservices.auth) private readonly authClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user_by_id');
    this.authClient.subscribeToResponseOf('get_user_by_email');
    await this.authClient.connect();
  }

  createUser(createUserDto: CreateUserDto) {
    this.authClient.emit('create_user', JSON.stringify(createUserDto));
  }

  getUserById(userId: number): Promise<User | null> {
    return firstValueFrom(
      this.authClient.send('get_user_by_id', JSON.stringify({ userId }))
    );
  }

  getUserByEmail(userEmail: string): Promise<User | null> {
    return firstValueFrom(
      this.authClient.send('get_user_by_email', JSON.stringify({ userEmail }))
    );
  }
}
