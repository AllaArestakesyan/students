import { Injectable, HttpException, HttpStatus, BadRequestException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Role } from 'src/user/role/enum.role';
import { TeacherService } from 'src/teacher/teacher.service';
import { StudentService } from 'src/student/student.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private groupService: GroupService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    if (!user.isVerified) {
      throw new HttpException('Is not verified', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      username: user.email,
      userId: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      role:user.role
    };
  }

  async register(userDto: CreateUserDto) {
    const { email, name, surname, password, phone_number, role, groupId } = userDto;
    const user = await this.userService.findOneBy(email);
    if (user) {
      throw new HttpException('Email is already in use.', HttpStatus.BAD_REQUEST);
    } else {
      const emailToken = uuidv4();
      const createdUser = await this.userService.create({
        name,
        surname,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
        emailToken,
        isVerified: 0,
        phone_number
      });
      if (role == Role.STUDENT) {
        const x = await this.groupService.findBy(groupId);
        if (!x) {
          await this.studentService.create({ user: createdUser, groupId })
        }else{
          await this.studentService.create({ user: createdUser, group:null })
        }
      } else if (role == Role.TEACHER) {
        await this.teacherService.create({ user: createdUser })
      }
      try {
        const url = `http://localhost:3000/verify?email=${email}&emailToken=${emailToken}`;
        await this.mailerService.sendMail({
          to: "...",
          // to:email,
          from: '...',
          subject: 'Welcome to Shop! Confirm your Email',
          html: `Hi! There, You have recently visited 
          our website and entered your email.
          Please follow the given link to verify your email
          <a href='${url}'>click</a> 

        <h4>This is your login -> ${email}</h4>
        <h4>This is your password ->  ${password}</h4>

          Thanks`
        });
      } catch (e) {
        console.log(e.message);
      }
      return {
        message: "Registration successful."
      };
    }
  }
}