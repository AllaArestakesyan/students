import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Modules } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Modules])],
  controllers: [ModuleController],
  providers: [ModuleService]
})
export class ModuleModule {}
