import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Request, Res } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';

@ApiTags('Student*')
@Controller('student')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել բոլոր ուսանողներին" })
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const data = await this.studentService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել ուսանողին ըստ id-ի, ինչպես նաև տվյալ ուսանողի խումբը" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.studentService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել ուսանողներին ըստ groupid-ի" })
  @Get('getStudentByGroupId/:id')
  async getStudentByGroupId(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.studentService.getStudentByGroupId(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս լոգին եղած ուսանողին տեսնել իր խումբը և իր մոդուլները" })
  @HasRoles(Role.STUDENT)
  @Get('getGroupByStudentId/find')
  async getGroupByStudentId( @Request() req, @Res() res: Response) {
    try {
      const data = await this.studentService.getGroupByStudentId(req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }


  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս  լոգին եղած ուսանողին ըստ մոդուլի տեսնել տնային աշխատանքները, գնահատականները ինչպես իր այնպես էլ խմբի անդամների" })
  @HasRoles(Role.STUDENT)
  @Get('getHomeworkStudentByGroupModuleId/:id')
  async getHomeworkStudentByGroupModuleId( @Param('id') id: number, @Request() req, @Res() res: Response) {
    try {
      const data = await this.studentService.getHomeworkStudentByGroupModuleId(req.user.userId, id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս ուսանողի խումբը փոխել" })
  @HasRoles(Role.ADMIN)
  @Patch('updateGroup/:id')
  async updateModule(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.studentService.updateGroup(+id, updateStudentDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}