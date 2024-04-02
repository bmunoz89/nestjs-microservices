import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto } from '@shared/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user: { name: string } = await this.authService.getUserByEmail(
      createUserDto.email
    );
    if (user) {
      throw new ConflictException('User already exist');
    }
    return this.authService.createUser(createUserDto);
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body(ValidationPipe) getUserDto: GetUserDto) {
    const user = await this.authService.getUserByEmail(getUserDto.email);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
