import { Injectable } from '@nestjs/common';
import { User } from '@shared/entities';

@Injectable()
export class UserRepository {
  private readonly users: User[] = [];

  save(user: User) {
    user.id = this.users.length + 1;
    this.users.push({ ...user, id: user.id });
    console.log(`user created for '${user.email}' with id '${user.id}'`);
  }

  getUserById(id: number) {
    return this.users.find((u) => u.id === id) ?? null;
  }

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null;
  }
}
