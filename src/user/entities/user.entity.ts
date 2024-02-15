import { Student } from 'src/student/entities/student.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../role/enum.role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column()
  role: Role;

  @Column({ default: "user.png" })
  pic_url: string;

  @Column()
  emailToken: string;

  @Column({ default: null })
  code: number;

  @Column({ default: 0 })
  isVerified: number;

  @OneToMany(type => Student, student => student.user, { cascade: true })
  student: Student[]

  @OneToMany(type => Teacher, teacher => teacher.user, { cascade: true })
  teacher: Teacher[]
}

