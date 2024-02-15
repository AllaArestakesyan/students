import { Controller, Get, Param, UseGuards, HttpCode, HttpStatus, Request, Res } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';

@ApiTags('Teacher*')
@Controller('teacher')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) { }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս բոլոր դասախոսներին" })
  @Get()
  async findAll() {
    return await this.teacherService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս դասախոսին ըստ id-ի, ինչպես նաև տվյալ դասախոսի խմբերը" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.teacherService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս լոգին եղած դասախոսին տեսնել իր բոլոր խմբրին, և տվյալ խմբի ուսանողներին" })
  @HasRoles(Role.TEACHER)
  @Get('getTeacherGroupModuleByToken/find')
  async getTeacherGroupModuleByToken(  @Request() req, @Res() res: Response) {
    try {
      const data = await this.teacherService.getTeacherGroupModuleByToken(req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}