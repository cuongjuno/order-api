import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, email, full_name } = createUserDto;
    const user: User = await this.usersRepository.create({
      password,
      email,
      full_name,
    });
    await this.usersRepository.save(user);
    return user;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findUser(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`There isn't any user with id: ${id}`);
    }
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
