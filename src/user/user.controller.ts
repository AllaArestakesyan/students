import { Controller, Get, UploadedFile, Request, UseInterceptors, HttpCode, HttpStatus, UseGuards, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/upload/config';
import { HasRoles } from './role/roles.decorator';
import { Role } from './role/enum.role';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Verify } from './dto/verify.dto';
import { ForgotPassword } from './dto/forgot-password';
import { ResetPassword } from './dto/reset-password';

@ApiTags("User*")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս տեսնել բոլոր գրանցված մարդկանց" })
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const data = await this.userService.findAll(req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "գրանցվելիս հարկավոր է իրականացնել վերիֆիկացիա ըստ email, հարցմանը հարկավոր է ուղարկել 2 տվյալ email և emailToken, որը հարկավոր է վերցնել path-ից" })
  @Post("/verify")
  async verify(@Body() user: Verify, @Res() res: Response) {
    try {
      const data = await this.userService.verify(user);
      return res.status(HttpStatus.OK).json(data)
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message })
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս տեսնել user-ի տվյալը ըստ id-ի" })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.userService.findOneById(+id);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ description: "հնարավորություն է տալիս փոփոխել user-ի password" })
  @Patch('/us/changepassword')
  async changePassword(@Body() changePassword: ChangePasswordDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.changePassword(changePassword, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiResponse({ description: "հնարավորություն է տալիս փոփոխել user-ի նկարը" })
  @Patch('/updatePicUrl')
  async update(@Res() res: Response, @UploadedFile() file, @Request() req) {
    try {
      const data = await this.userService.updatePic(req.user.userId, file);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @Patch('/us/updateData')
  @ApiResponse({ description: "հնարավորություն է տալիս փոփոխել user-ի name, surname" })
  async updateData(@Body() updateUserDto: UpdateUserDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.updateData(req.user.userId, updateUserDto)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Patch('/us/forgotPassword')
  @ApiResponse({ description: "forgotPassword հնարավորություն է տալիս տվյալ user-ին նոր password գրել\nտվյալ user email-ին հաղորդագրություն է հնում, որտեղ կլինի 6-նիշ թիվ" })
  async forgotPassword(@Body() forgotPassword: ForgotPassword, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.forgotPassword(forgotPassword)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: "ըստ email-ի և 6-նիշ code-ի հնարավորություն է տալիս փոխել password-ը" })
  @Patch('/us/resetPassword/:email')
  async resetPassword(@Body() resetPassword: ResetPassword, @Param("email") email: string, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.resetPassword(resetPassword, email)
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @HasRoles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս ջնջել user-ին" })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.remove(+id, req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}