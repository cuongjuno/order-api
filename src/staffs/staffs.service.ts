import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(Staff)
    private staffsRepository: Repository<Staff>,
  ) {}
  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const { password, email, full_name } = createStaffDto;
    const staff: Staff = await this.staffsRepository.create({
      password,
      email,
      full_name,
    });
    await this.staffsRepository.save(staff);
    return staff;
  }

  findAll(): Promise<Staff[]> {
    return this.staffsRepository.find();
  }

  findOne(id: number): Promise<Staff> {
    return this.staffsRepository.findOne({ where: { id } });
  }

  findStaff(email: string): Promise<Staff> {
    return this.staffsRepository.findOne({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const user = await this.staffsRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    Object.assign(user, updateStaffDto);

    return this.staffsRepository.save(user);
  }
  async remove(id: number): Promise<void> {
    await this.staffsRepository.delete(id);
  }
}
