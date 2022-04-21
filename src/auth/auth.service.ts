import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateStaffDto } from 'src/staffs/dto/create-staff.dto';
import { Staff } from 'src/staffs/entities/staff.entity';
import { StaffsService } from 'src/staffs/staffs.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly staffsService: StaffsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User | string> {
    const response = await this.userService.create(createUserDto);
    if (typeof response !== 'string') delete response.password;

    return response;
  }

  async registerStaff(createStaffDto: CreateStaffDto): Promise<Staff | string> {
    const response = await this.staffsService.create(createStaffDto);
    if (typeof response !== 'string') delete response.password;

    return response;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    } else if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${email}`,
      );
    }

    delete user.password;

    const access_token = this.signToken(user);

    return { ...user, access_token };
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findUser(payload.sub);
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
