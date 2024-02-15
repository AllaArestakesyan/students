import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode, Request, Res } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDtoModule, UpdateGroupDtoName, UpdateGroupDtoTeacher } from './dto/update-group.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { HasRoles } from 'src/user/role/roles.decorator';
import { Role } from 'src/user/role/enum.role';
import { Response } from 'express';

@ApiTags('Group*')
@Controller('group')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս նոր խումբ ստեղծել, նախապես նշելով տվյալ խմբի դասախոսին" })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.create(createGroupDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել բելեր խմբերը" })
  @HasRoles(Role.ADMIN, Role.TEACHER)
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.findAll();
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "հնարավորություն է տալիս տեսնել խումբը ըստ id-ի,\n ինչպես նաը տեսնել դասախոսին,\n մոդուլները որը որ արդեն իսկ տվյալ խումբը անցել է" })
  @HasRoles(Role.ADMIN, Role.TEACHER)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.findOne(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս փոխել խմբի անունը" })
  @Patch('updateName/:id')
  async updateName(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDtoName, @Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.updateName(+id, updateGroupDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  
  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս փոխել խմբի դասախոսին" })
  @Patch('updateTeacher/:id')
  async updateTeacher(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDtoTeacher, @Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.updateTeacher(+id, updateGroupDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN, Role.TEACHER)
  @ApiResponse({ description: "ADMIN-ին և TEACHER-ին հնարավորություն է խմբին նոր մոդուլ ավելացնել" })
  @Patch('updateModule/:id')
  async updateModule(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDtoModule, @Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.updateModule(+id, updateGroupDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս ջնջել խումբը" })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const data = await this.groupService.remove(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}