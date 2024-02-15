import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { ModuleGroup } from 'src/module-group/entities/module-group.entity';
import { Modules } from 'src/module/entities/module.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, ModuleGroup, Modules, Teacher])
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
