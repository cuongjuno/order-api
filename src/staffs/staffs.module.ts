import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { Staff } from './entities/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsStaffAlreadyExist } from './is-staff-already-exist.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [StaffsController],
  providers: [StaffsService, IsStaffAlreadyExist],
})
export class StaffsModule {}
