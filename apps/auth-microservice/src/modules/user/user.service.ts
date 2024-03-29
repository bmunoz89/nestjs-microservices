import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@shared/dto';
import { User } from '@shared/entities';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(data: CreateUserDto): void {
    this.userRepository.save(data);
  }

  getUserById(id: number): User | null {
    return this.userRepository.getUserById(id);
  }

  getUserByEmail(email: string): User | null {
    return this.userRepository.getUserByEmail(email);
  }
}
