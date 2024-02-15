import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Homework } from 'src/homework/entities/homework.entity';
import { Student } from 'src/student/entities/student.entity';
import { Grade } from './entities/grade.entity';
import { ModuleGroup } from 'src/module-group/entities/module-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Homework, Student, Grade, ModuleGroup])],
  controllers: [GradesController],
  providers: [GradesService]
})
export class GradesModule {}
