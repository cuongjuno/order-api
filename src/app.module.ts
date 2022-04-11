import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { StaffsModule } from './staffs/staffs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // url: 'postgres://user:password@postgres:5432/db',
      host: '127.0.0.1',
      username: 'postgres',
      password: 'root',
      port: 5432,
      database: 'order',
      autoLoadEntities: true,
      synchronize: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['src/migrations/*.ts', 'dist/migrations/*{.ts,.js}'],
    }),
    UsersModule,
    AuthModule,
    StaffsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
