import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/users/user.decorator';

import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto): Promise<User | string> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiBody({
    type: LogInDto,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Get('/me')
  @UseGuards(JWTAuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }

  @Post('staff/register')
  @HttpCode(HttpStatus.CREATED)
  registerStaff(@Body() createUserDto: CreateUserDto): Promise<User | string> {
    return this.authService.register(createUserDto);
  }

  @Post('staff/login')
  @ApiBody({
    type: LogInDto,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async loginStaff(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Get('staff/me')
  @UseGuards(JWTAuthGuard)
  meStaff(@AuthUser() user: User): User {
    return user;
  }
}
