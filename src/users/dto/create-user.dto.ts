import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUserAlreadyExist } from '../is-user-already-exist.validator';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  // @Validate(IsUserAlreadyExist)
  readonly email: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  full_name: string;
}
