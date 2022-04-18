import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import { Staff } from './entities/staff.entity';

@ValidatorConstraint({ name: 'isStaffAlreadyExist', async: true })
@Injectable()
export class IsStaffAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  async validate(email: string): Promise<boolean> {
    const staff = await this.staffRepository.findOneBy({ email });

    return isNullOrUndefined(staff);
  }

  defaultMessage(): string {
    return 'The email «$value» is already register.';
  }
}
