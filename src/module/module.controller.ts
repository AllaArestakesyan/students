import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode, Res, Request } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ChangeModuleDto, UpdateModuleDto } from './dto/update-module.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { Response } from 'express';

@ApiTags('Module*')
@Controller('module')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս նոր մոդուլ ավելացնել կուրսից,\n եթե տվյալ մոդուլը կուրսում արդեն իսկ կա, ապա չի ավելացնում" })
  @Post()
  async create(@Body() createModuleDto: CreateModuleDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.create(createModuleDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել բոլոր մոդուլները" })
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել մոդուլը ըստ id-ի" })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել մոդուլը ըստ courseId-ի" })
  @Get('findByCourseId/:id')
  async findByCourseId(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.findByCourseId(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս թարմացնել մոդուլի անունը" })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.update(+id, updateModuleDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս թարմացնել մոդուլի կուրսը" })
  @Patch('changeCourse/:id')
  async changeCourse(@Param('id') id: string, @Body() changeModuleDto: ChangeModuleDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.changeCourse(+id, changeModuleDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս ջնջել մոդուլը" })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.moduleService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}