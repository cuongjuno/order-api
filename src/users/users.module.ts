import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsUserAlreadyExist } from './is-user-already-exist.validator';
import { SendEmailService } from 'src/send-email/send-email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, IsUserAlreadyExist, SendEmailService],
  exports: [UsersService],
})
export class UsersModule {}
