import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {

  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createTeacherDto: CreateTeacherDto) {
    const user = this.teacherRepository.create(createTeacherDto);
    return this.teacherRepository.save(user);
  }

  async findAll() {
    return await this.teacherRepository.find({
      relations: {
        user: true
      }
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id }
    })
    if (user) {
      const teacher = await this.teacherRepository.findOne({
        where: { user },
        relations: {
          user: true,
          groups: true
        }
      });
      if (teacher) {
        return teacher;
      } else {
        return new NotFoundException('teacher not found');
      }
    } else {
      return new NotFoundException('user not found');
    }
  }
  async getTeacherGroupModuleByToken(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id }
    })
    if (user) {
      const teacher = await this.teacherRepository
      .createQueryBuilder("teacher")
      .innerJoinAndSelect("teacher.groups", "group")
      // .innerJoinAndSelect("group.students", "student")
      // .innerJoinAndSelect("student.user", "user")
      .innerJoinAndSelect("group.moduleGroups", "module_group")
      .innerJoinAndSelect("module_group.module", "module")
      .where("teacher.userId=:id" , {id:user.id})
      // .select(['teacher', "group","module_group", "module", "student", "user.name", "user.surname", "user.email", "user.pic_url"])
      .getMany()
      if (teacher) {
        return teacher;
      } else {
        return new NotFoundException('teacher not found');
      }
    } else {
      return new NotFoundException('user not found');
    }
  }
}