import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Request } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { Response } from 'express';

@ApiTags('Homework*')
@Controller('homework')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.TEACHER)
  @ApiResponse({ description: "TEACHER-ին հնարավորություն է տալիս տնային աշխատանք ավելացնել ըստ moduleGroupsId" })
  @Post()
  async create(@Body() createHomeworkDto: CreateHomeworkDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.homeworkService.create(createHomeworkDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել տնային աշխատանքը ըստ id-ի" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.homeworkService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել տնային աշխատանքը ըստ ModuleGroupId-ի" })
  @Get('findHomeworksByModuleGroupId/:id')
  async findHomeworksByModuleGroupId(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.homeworkService.findHomeworksByModuleGroupId(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.TEACHER)
  @ApiResponse({ description: "TEACHER-ին հնարավորություն է տալիս ջնջել տնային աշխատանքը" })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.homeworkService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
