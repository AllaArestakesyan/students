import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from './entities/homework.entity';
import { ModuleGroup } from 'src/module-group/entities/module-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Homework, ModuleGroup])],
  controllers: [HomeworkController],
  providers: [HomeworkService]
})
export class HomeworkModule {}
