import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { ChangeModuleDto, UpdateModuleDto } from './dto/update-module.dto';
import { Modules } from './entities/module.entity';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Modules)
    private modulesRepository: Repository<Modules>,
  ) { }

  async create(createModuleDto: CreateModuleDto) {
    const { name, courseId } = createModuleDto;
    const course = await this.courseRepository.findOne({
      where: {
        id: courseId
      },
      relations: {
        modules: true
      }
    });
    if (course) {
      const x = course.modules.find(elm => elm.name.toLowerCase() == name.toLowerCase())
      if (x) {
        throw new NotFoundException(`Oops! ${name} has already`);
      } else {
        return await this.modulesRepository.save({ name, course });

      }
    } else {
      throw new NotFoundException("course not found");
    }
  }

  async findAll() {
    return await this.modulesRepository.find();
  }

  async findOne(id: number) {
    return await this.modulesRepository.findOne({
      where: {
        id
      },
      relations: {
        course: true
      }
    });
  }
  async findByCourseId(id: number) {
    const x = await this.courseRepository.findOne({
      where: {
        id
      },
      relations: {
        modules: true
      }
    });
    if (x) {
      return x.modules
    } else {
      throw new NotFoundException("course not found");
    }
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    const { name } = updateModuleDto;
    const module = await this.modulesRepository.findOne({
      where: {
        id
      },
    });
    if (module) {
      await this.modulesRepository.update(id, { name })
      return true;
    } else {
      throw new NotFoundException("module not found");
    }
  }
  async changeCourse(id: number, changeModuleDto: ChangeModuleDto) {
    const { courseId } = changeModuleDto;
    const module = await this.modulesRepository.findOne({
      where: {
        id
      },
    });
    const course = await this.courseRepository.findOne({
      where: {
        id: courseId
      },
      relations: {
        modules: true
      }
    });
    if (course && module) {
      const x = course.modules.find(elm => elm.name.toLowerCase() == module.name.toLowerCase())
      if (x) {
        throw new NotFoundException(`Oops! ${name} has already`);
      } else {
        await this.modulesRepository.update({ id }, { course })
        return "update";

      }
    } else {
      throw new NotFoundException("course or module not found");
    }
  }

  async remove(id: number) {
    const module = await this.modulesRepository.findOne({
      where: {
        id
      },
    });
    if (module) {
      await this.modulesRepository.delete(id)
      return true;
    } else {
      return false;
    }
  }
}