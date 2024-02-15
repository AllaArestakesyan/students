import { Controller, HttpCode, HttpStatus, Request, Get, Post, Body, Res } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/user/role/enum.role';
import { HasRoles } from 'src/user/role/roles.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LocalAuthGuard } from '../local-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginUser } from '../dto/login.dto';

@ApiTags("Auth*")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private userService: UserService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ description: "հնարավորություն է լօգին լինել ըստ email-ի և password-ի" })
  @Post('login')
  async login(@Body() us: LoginUser, @Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @HasRoles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ description: "ADMIN-ին հնարավորություն է տալիս նոր teacher կամ student ավելացնել" })
  @Post('register')
  async register(@Body() registerDto: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.authService.register(registerDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "ըստ access_token-ի վերադարձնում է տվյալ user-ի տվյալները " })
  @Get('profile')
  async getProfile(@Request() req, @Res() res: Response) {
    try {
      const data = await this.userService.findOneById(req.user.userId);
      return res.status(HttpStatus.OK).json(data);
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ description: "ըստ access_token-ի վերադարձնում է տվյալ user-ի տվյալները " })
  @Get('logout')
  async getLogout(@Request() req, @Res() res: Response) {
    try {
      req.res.setHeader('Set-Cookie', req.user);
      return res.status(HttpStatus.OK).json({ message: "logout" });
    } catch (e) {
      return res.status(HttpStatus.OK).json({ message: e.message });
    }
  }
}