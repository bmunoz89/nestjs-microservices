import {
  Controller,
  Logger,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@shared/dto';
import { EventPatterns, MessagePatterns } from '@shared/enums';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(EventPatterns.CREATE_USER)
  handleUserCreate(@Payload(ValidationPipe) data: CreateUserDto) {
    const user = this.userService.getUserByEmail(data.email);
    if (user) return;
    this.userService.createUser(data);
  }

  @MessagePattern(MessagePatterns.USER_BY_ID)
  handleGetUser(@Payload('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @MessagePattern(MessagePatterns.USER_BY_EMAIL)
  handleFinUser(@Payload('userEmail') userEmail: string) {
    return this.userService.getUserByEmail(userEmail);
  }
}
