import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email?: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
