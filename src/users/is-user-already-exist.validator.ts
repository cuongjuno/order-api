import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import { User } from './entities/user.entity';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(email: string): Promise<boolean> {
    console.log('email', this.userRepository);

    const user = await this.userRepository.findOne({ where: { email: 'ok' } });

    return isNullOrUndefined(user);
  }

  defaultMessage(): string {
    return 'The email «$value» is already register.';
  }
}
