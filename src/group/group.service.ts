import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleGroup } from 'src/module-group/entities/module-group.entity';
import { Modules } from 'src/module/entities/module.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDtoModule, UpdateGroupDtoName, UpdateGroupDtoTeacher } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {

  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Modules)
    private modulesRepository: Repository<Modules>,
    @InjectRepository(ModuleGroup)
    private moduleGroupRepository: Repository<ModuleGroup>,
    @InjectRepository(Teacher)
    private teacherGroupRepository: Repository<Teacher>,
  ) { }

  async create(createGroupDto: CreateGroupDto) {
    const { name, teacherId, activeModuleId } = createGroupDto;
    const teacher = await this.teacherGroupRepository.findOne({
      where: {
        userId: teacherId
      }
    })
    const module = await this.modulesRepository.findOne({
      where: {
        id: activeModuleId
      }
    })
    if (teacher && module) {
      const g = await this.groupRepository.findOne({
        where: {
          name
        }
      })
      if (g) {
        throw new BadRequestException(`Oops! ${name} has already`)
      } else {
        const group = await this.groupRepository.save({
          name,
          activeModuleId,
          teacher
        })
        const moduleGroup = await this.moduleGroupRepository.save({
          group,
          module
        })
        return { group, moduleGroup }
      }
    } else {
      throw new NotFoundException("Oops! teacher or module not found")
    }
  }

  async findAll() {
    return await this.groupRepository.find();
  }
  async findBy(id: number) {
    return await this.groupRepository.findOne({ where: { id } });
  }

  async findOne(id: number) {
    const group = await this.groupRepository
      .createQueryBuilder("group")
      .innerJoinAndSelect("group.teacher", "teacher")
      .innerJoinAndSelect("teacher.user", "user")
      .innerJoinAndSelect("group.moduleGroups", "module_group")
      .innerJoinAndSelect("module_group.module", "module")
      .innerJoinAndSelect("module.course", "course")
      .innerJoinAndSelect("group.students", "student")
      .where("group.id=:id", { id })
      .getOne()
    if (group) {
      return group;
    } else {
      throw new NotFoundException('group not found');
    }
  }

  async updateName(id: number, updateGroupDto: UpdateGroupDtoName) {
    const { name } = updateGroupDto
    const g = await this.groupRepository.findOne({
      where: {
        name
      }
    })
    if (g) {
      if (g.id != id) {
        throw new BadRequestException(`Oops! ${name} has already`)
      } else {
        return "your group name  " + name
      }
    } else {
      await this.groupRepository.update({ id }, { name })
      return true;
    }
  }
  async updateTeacher(id: number, updateGroupDto: UpdateGroupDtoTeacher) {
    const { teacherId } = updateGroupDto
    const teacher = await this.teacherGroupRepository.findOne({
      where: {
        userId: teacherId
      }
    })
    if (teacher) {
      const g = await this.groupRepository.findOne({
        where: {
          id
        }
      })
      if (g) {
        await this.groupRepository.update({ id }, { teacher })
        return true;
      } else {
        throw new NotFoundException("Oops! group not found")
      }
    } else {
      throw new NotFoundException("Oops! teacher not found")
    }
  }

  async updateModule(id: number, updateGroupDto: UpdateGroupDtoModule) {
    const { activeModuleId } = updateGroupDto
    const module = await this.modulesRepository.findOne({
      where: {
        id: activeModuleId
      }
    })
    if (module) {
      const group = await this.groupRepository.findOne({
        where: {
          id
        }
      })
      if (group) {
        const moduleGroup = await this.moduleGroupRepository.findOne({
          where: {
            group,
            module
          }
        })
        await this.groupRepository.update({ id }, {
          activeModuleId
        })
        if (!moduleGroup) {
          await this.moduleGroupRepository.save({
            group,
            module
          })
        }
        return true;
      }
    } else {
      throw new NotFoundException("Oops! module not found")
    }
  }

  async remove(id: number) {
    const prod = await this.groupRepository.findOneBy({ id });
    if (prod) {
      await this.groupRepository.delete({ id })
      return true;
    } else {
      return false;
    }
  }
}
