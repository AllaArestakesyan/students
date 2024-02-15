import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleGroup } from 'src/module-group/entities/module-group.entity';
import { Repository } from 'typeorm';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { Homework } from './entities/homework.entity';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,
    @InjectRepository(ModuleGroup)
    private moduleGroupRepository: Repository<ModuleGroup>,
  ) { }

  async create(createHomeworkDto: CreateHomeworkDto) {
    const { moduleGroupsId, ...data } = createHomeworkDto;
    const module = await this.moduleGroupRepository.findOne({
      where: {
        id: moduleGroupsId
      }
    })
    if (module) {
      const moduleGroups = await this.moduleGroupRepository.findOne({
        where: {
          id: moduleGroupsId
        },
        relations: {
          homeworks: true
        }
      })
      const x = moduleGroups.homeworks.find(elm => elm.taskNumber == data.taskNumber)
      if (!x) {
        return await this.homeworkRepository.save({
          ...data,
          moduleGroups
        })
      } else {
        return new BadRequestException('task number this group module has already');
      }
    } else {
      return new BadRequestException('moduleGroups not found');
    }
  }

  async findOne(id: number) {
    const homework = await this.homeworkRepository.findOne({
      where: {
        id,
      },
      relations: {
        moduleGroups: true,
        grades: true
      }
    });
    if (homework) {
      return homework;
    } else {
      return new BadRequestException('homework id not found');
    }
  }

  async findHomeworksByModuleGroupId(id: number) {
    const moduleGroups = await this.moduleGroupRepository.findOne({
      where: {
        id
      }
    })
    if (moduleGroups) {
      const homework = await this.homeworkRepository.find({
        where: {
          moduleGroups
        },
      });
      return homework;
    } else {
      return new BadRequestException('moduleGroups id not found');
    }
  }

  async remove(id: number): Promise<boolean> {
    const home = await this.homeworkRepository.findOneBy({ id });
    if (home) {
      this.homeworkRepository.delete({ id })
      return true;
    } else {
      return false;
    }
  }
}