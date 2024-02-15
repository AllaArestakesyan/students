import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) { }

  async create(createStudentDto: CreateStudentDto) {
    const user = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(user);
  }

  async findAll() {
    return await this.studentRepository.find({
      relations: {
        user: true
      }
    })
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id }
    })
    if (user) {
      const student = await this.studentRepository.findOne({
        where: { user },
        relations: {
          user: true,
          group: true
        }
      });
      if (student) {
        return student;
      } else {
        return new NotFoundException('student not found');
      }
    } else {
      return new NotFoundException('user not found');
    }
  }

  async updateGroup(id: number, updateStudentDto: UpdateStudentDto) {
    const { groupId } = updateStudentDto
    const group = await this.groupRepository.findOne({ where: { id: groupId } })
    const student = await this.studentRepository.findOne({ where: { userId: id } })
    if (group && student) {
      await this.studentRepository.update({ userId: id }, { group })
      return true;
    } else {
      return new BadRequestException('group or student not found');
    }
  }
  async getStudentByGroupId(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id }
    })
    if (group) {
      const student = await this.studentRepository
      .createQueryBuilder("student")
      .innerJoinAndSelect("student.group", "group")
      .innerJoinAndSelect("student.user", "user")
      .innerJoinAndSelect("student.grades", "grade")
      .select(['student', 'group', 'grade','user.name', 'user.surname', 'user.pic_url'])
      .where("group.id=:id", {id:group.id})
      .getMany()
      if (student) {
        return student.map(elm => ({ ...elm.user, grades: elm.grades.reduce((a, b) => a + b.rating, 0) / elm.grades.length }));
      } else {
        return new NotFoundException('student not found');
      }
    } else {
      return new NotFoundException('group not found');
    }
  }
  async getGroupByStudentId(id: number) {
    const student = await this.studentRepository.findOne({
      where: { userId: id },
      relations: {
        group: true
      }
    })
    console.log(id, student);
    if (student) {
      const group = await this.groupRepository
        .createQueryBuilder("group")
        .innerJoinAndSelect("group.moduleGroups", "module_group")
        .innerJoinAndSelect("module_group.module", "modules")
        .where("group.id=:id", { id: student.group.id })
        .getMany()
      if (group) {
        return group;
      } else {
        return new NotFoundException('group not found');
      }
    } else {
      return new NotFoundException('student not found');
    }
  }
  async getHomeworkStudentByGroupModuleId(id: number, groupModuleId: number) {
    const student = await this.studentRepository.findOne({
      where: { userId: id },
      relations: {
        group: true
      }
    })
    console.log(id, student, groupModuleId);
    if (student) {
      const group = await this.groupRepository
        .createQueryBuilder("group")
        .innerJoinAndSelect("group.moduleGroups", "module_group")
        .innerJoinAndSelect("module_group.module", "modules")
        .innerJoinAndSelect("module_group.homeworks", "homework")
        // .innerJoinAndSelect("homework.grades", "grade")
        // .innerJoinAndSelect("grade.student", "student")
        // .innerJoinAndSelect("student.user", "user")
        .where("group.id=:id", { id: student.group.id })
        .andWhere("module_group.id=:gid", {gid:groupModuleId})
        // .andWhere("modules.id=:id", { id: moduleId })
        // .select(['group.name', 'module_group', "modules", "homework", 'grade', 'student', 'user.name',  'user.surname', 'user.pic_url'])
        .getMany()
      if (group) {
        // return group
        return group;
      } else {
        return new NotFoundException('group not found');
      }
    } else {
      return new NotFoundException('student not found');
    }
  }
}
