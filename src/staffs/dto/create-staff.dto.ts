import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
} from 'class-validator';
import { IsStaffAlreadyExist } from '../is-staff-already-exist.validator';

export class CreateStaffDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Validate(IsStaffAlreadyExist)
  readonly email: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  // @MinLength(8)
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  full_name: string;
}
