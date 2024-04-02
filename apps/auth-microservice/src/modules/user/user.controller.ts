import { Controller, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('create_user')
  handleUserCreate(@Payload(ValidationPipe) data: CreateUserDto) {
    const user: { name: string } = this.userService.getUserByEmail(data.email);
    if (user) {
      console.log(`user '${data.email}' already exist`);
      return;
    }
    this.userService.createUser(data);
  }

  @MessagePattern('get_user_by_id')
  handleGetUser(@Payload('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @MessagePattern('get_user_by_email')
  handleFinUser(@Payload('userEmail') userEmail: string) {
    return this.userService.getUserByEmail(userEmail);
  }
}
