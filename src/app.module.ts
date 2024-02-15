import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { GradesModule } from './grades/grades.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { User } from './user/entities/user.entity';
import { Student } from './student/entities/student.entity';
import { Teacher } from './teacher/entities/teacher.entity';
import { HomeworkModule } from './homework/homework.module';
import { CourseModule } from './course/course.module';
import { ModuleModule } from './module/module.module';
import { Course } from './course/entities/course.entity';
import { Grade } from './grades/entities/grade.entity';
import { Group } from './group/entities/group.entity';
import { Homework } from './homework/entities/homework.entity';
import { Modules } from './module/entities/module.entity';
import { ModuleGroup } from './module-group/entities/module-group.entity';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username:"root",
      password:"",
      database:"test3",
      entities: [User, Student, Teacher, Course, Grade, Group, Homework, Modules, ModuleGroup],
      autoLoadEntities:true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '...',
          pass: '...',
        },
      },
    }),
    AuthModule,
    UserModule, 
    StudentModule,
    TeacherModule,
    CourseModule,
    ModuleModule,
    GroupModule, 
    // ModuleGroupModule,
    HomeworkModule,
    GradesModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
