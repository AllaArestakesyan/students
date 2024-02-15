import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';
import { Homework } from 'src/homework/entities/homework.entity';
import { ModuleGroup } from 'src/module-group/entities/module-group.entity';
import { Student } from 'src/student/entities/student.entity';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {

  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(ModuleGroup)
    private moduleGroupRepository: Repository<ModuleGroup>,
  ) { }

  async create(createGradeDto: CreateGradeDto) {
    const { studentId, homeworkId, rating } = createGradeDto;
    const homework = await this.homeworkRepository.findOne({
      where: {
        id: homeworkId
      }
    })
    const student = await this.studentRepository.findOne({
      where: {
        userId: studentId
      }
    })
    if (homework && student) {
      const x = await this.gradeRepository.findOne({
        where: {
          homework, student
        },
      })
      if (!x) {
        return await this.gradeRepository.save({
          rating,
          student,
          homework
        })
      } else {
        await this.gradeRepository.update({ id: x.id }, { rating })
        return 'update'
      }
    } else {
      return new BadRequestException('homework or student not found');
    }
  }

  async getRateByModuleGroupId(id: number) {
    const moduleGroup = await this.moduleGroupRepository.findOne({
      where: {
        id: id
      },
      relations:{
        group:true
      }
    })
    if (moduleGroup) {
      // const grade = await this.moduleGroupRepository 
      //   .createQueryBuilder("module_group") 
      //   // .where("module_group.id=:id", { id }) 
      //   // .innerJoinAndSelect("module_group.homeworks", "homework") 
      //   // .innerJoinAndSelect("homework.grades", "grade") 
      //   // .innerJoinAndSelect("grade.student", "student") 
      //   // .innerJoinAndSelect("student.user", "user") 
      //   // .select(["module_group.id", "homework.id", "homework.taskNumber", "grade.id", "grade.rating", "student.userId", "user.name", "user.surname",]) 
      //   // .orderBy("homework.id") 
      //   // .getMany() 
 
      //   .where("module_group.id=:id", { id }) 
      //   .innerJoinAndSelect("module_group.homeworks", "homework") 
      //   .innerJoinAndSelect("homework.grades", "grade") 
      //   .innerJoinAndSelect("grade.student", "student") 
      //   .innerJoinAndSelect("student.user", "user") 
      //   // .innerJoinAndSelect("student.grades", "grade") 
      //   // .innerJoinAndSelect("grade.homework", "homework") 
      //   .select(["module_group.id", "homework.id", "homework.taskNumber", "grade.id", "grade.rating", "student.userId", "user.name", "user.surname",]) 
      //   // .orderBy("homework.id") 
      //   .getOne()


      //   // .where("module_group.id=:id", { id }) 
      //   // .innerJoinAndSelect("module_group.group", "group") 
      //   // .innerJoinAndSelect("group.students", "student") 
      //   // .innerJoinAndSelect("student.user", "user") 
      //   // .innerJoinAndSelect("student.grades", "grade") 
      //   // .innerJoinAndSelect("grade.homework", "homework") 
      //   // // .select(["module_group.id", "homework.id", "homework.taskNumber", "grade.id", "grade.rating", "student.userId", "user.name", "user.surname",]) 
      //   // // .orderBy("homework.id") 
      //   // .getOne()

      const homeworks =await this.homeworkRepository.find({
        where:{
          moduleGroups:moduleGroup
        },
        relations:{
          // grades:true
        }
      })
      const students =await this.studentRepository.find({
        where:{
          group:moduleGroup.group
        },
        relations:{
          user:true
        },
        select:{
          user:{
            id:true,
            name:true,
            surname:true,
          }
        }
      })
      const grade = await this.gradeRepository
      .createQueryBuilder("grade")
      .innerJoinAndSelect("grade.homework", "homework")
      .innerJoinAndSelect("grade.student", "student")
      .innerJoinAndSelect("homework.moduleGroups", "module_group")
      .where("module_group.id=:id", {id})
      .select(["grade", "homework.id", "student.userId"])
      .getMany()
      if (homeworks) {
        return {homeworks, students, grade};
      } else {
        throw new NotFoundException('group not found');
      }
    } else {
      return new BadRequestException('moduleGroup not found');
    }
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    const { rating } = updateGradeDto;
    const grade = await this.gradeRepository.findOne({
      where: {
        id
      },
    });
    if (grade) {
      await this.gradeRepository.update(id, { rating })
      return true
    } else {
      throw new NotFoundException("grade not found");
    }
  }

  async remove(id: number): Promise<boolean> {
    const home = await this.gradeRepository.findOneBy({ id });
    if (home) {
      this.gradeRepository.delete({ id })
      return true;
    } else {
      return false;
    }
  }
}
