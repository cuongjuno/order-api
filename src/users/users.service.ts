import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendEmailService } from 'src/send-email/send-email.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private sendEmailService: SendEmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | string> {
    const { password, email, full_name } = createUserDto;
    const response = await this.sendEmailService
      .sendEmail({
        to: [email],
        subject: 'Register successful',
        content: `Register successful!`,
      })
      .then(async () => {
        const user: User = await this.usersRepository.create({
          password,
          email,
          full_name,
        });
        await this.usersRepository.save(user);
        return user;
      })
      .catch((e) => e);
    return response;
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
