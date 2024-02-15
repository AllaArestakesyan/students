import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    const { name } = createCourseDto;
    const course = await this.courseRepository.findOne({
      where: {
        name: Raw(n => `LOWER(${n}) = '${name}'`)
      },
    });
    if (course) {
      return `Oops! ${name} has already`;
    } else {

      return await this.courseRepository.save({ name });
    }
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: number) {
    return await this.courseRepository.findOne({
      where: {
        id
      },
      relations: {
        modules: true
      }
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const { name } = updateCourseDto;
    const course = await this.courseRepository.findOne({
      where: {
        id
      },
    });
    if (course) {
      await this.courseRepository.update(id, { name })
      return true;
    } else {
      throw new NotFoundException("course not found");
    }
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOne({
      where: {
        id
      },
    });
    if (course) {
      await this.courseRepository.delete(id)
      return true;
    } else {
      return false;
    }
  }
}