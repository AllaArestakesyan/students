import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/role/enum.role';
import { HasRoles } from 'src/user/role/roles.decorator';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Course*')
@Controller('course')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս նոր կուրս ավելացնել, եթե տվյալ կուրս արդեն իսկ կա, ապա չի ավելացնի" })
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.courseService.create(createCourseDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել բոլոր կուրսերը " })
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const data = await this.courseService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "տալիս կուրսը ըստ id-ի, ինչպես նաև տվյալ կուրսի բոլոր մոդուլները" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.courseService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս թարմացնել կուրսի տվյալները" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.courseService.update(+id, updateCourseDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս ջնջել կուրսը" })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.courseService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}