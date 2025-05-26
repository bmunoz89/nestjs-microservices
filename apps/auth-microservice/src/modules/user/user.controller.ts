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
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @EventPattern(EventPatterns.CREATE_USER)
  handleUserCreate(@Payload(ValidationPipe) data: CreateUserDto) {
    const user = this.userService.getUserByEmail(data.email);
    if (user) {
      this.logger.log(`user '${data.email}' already exist`);
      return;
    }
    this.userService.createUser(data);
  }

  @MessagePattern(MessagePatterns.USER_BY_ID)
  handleGetUser(@Payload('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @MessagePattern(MessagePatterns.USER_BY_EMAIL)
  handleFinUser(@Payload('userEmail') userEmail: string) {
    this.logger.log('userEmail :>> ', userEmail);
    return this.userService.getUserByEmail(userEmail);
  }
}
