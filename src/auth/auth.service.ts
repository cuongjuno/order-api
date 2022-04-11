import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUp: CreateUserDto): Promise<User> {
    const user = await this.userService.create(signUp);
    delete user.password;

    return user;
  }

  async login({ email, password }: LogInDto): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findUser(email);
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }

    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }
    delete user.password;

    return user;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      const email = payload.sub;
      user = await this.userService.findUser(email);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
    }
    delete user.password;

    return user;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
