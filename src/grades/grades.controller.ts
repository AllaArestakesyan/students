import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, Request } from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { Response } from 'express';

@ApiTags('Grades*')
@Controller('grades')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.TEACHER)
  @ApiResponse({ description: "TEACHER-ին հնարավորություն է տալիս գնահատել ուսանողի տնային աշխատանքը" })
  @Post()
  async create(@Body() createGradeDto: CreateGradeDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.gradesService.create(createGradeDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "ըստ ModuleGroup id-ի հնարավորություն է տալիս տեսնել տվյալ խմբի\n տվյալ մոդուլի բոլոր տնայինների գնահատականները\nև ուսանողների տվյալները" })
  @Get('getRateByModuleGroupId/:id')
  async getRateByModuleGroupId(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.gradesService.getRateByModuleGroupId(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.TEACHER)
  @ApiResponse({ description: "TEACHER-ին հնարավորություն է տալիս փոփոխել ուսանողի գնահատկանը տվյալ տնային աշխատանքից" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.gradesService.update(+id, updateGradeDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.TEACHER)
  @ApiResponse({ description: "TEACHER-ին հնարավորություն է տալիս ջնջել գնահատականը" })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.gradesService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}