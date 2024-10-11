import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import User from '../../domain/models/User';

import AuthenticationService from '../../application/service/AuthenticationService';
import { UserDto } from 'Authentication/application/dto/UserDto';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { OAuth2Client } from 'google-auth-library';
import { Mapper } from '@automapper/core';
import { LoginResponseDto } from 'Authentication/application/dto/LoginResponseDto';
import LoginResponse from 'Authentication/domain/models/LoginResponse';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import JwtAuthGuard from '../guards/JwtAuthGuard';

@Controller('auth')
export default class AuthenticationController {
  private clientId: string;
  private client: OAuth2Client;

  constructor(
    private userService: AuthenticationService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.clientId =
      '986130987946-4nrl9hrmsfev91861am7phdlguemu57k.apps.googleusercontent.com';
    this.client = new OAuth2Client(this.clientId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(User, UserDto, { isArray: true }))
  async getAllUsers(): Promise<UserDto[]> {
    return this.userService.fetchAllUsers().then((users) => users);
  }

  @Post('/login')
  @UseInterceptors(MapInterceptor(LoginResponse, LoginResponseDto))
  async login(
    @Body() userDto: UserDto,
    @I18n() i18n: I18nContext,
  ): Promise<LoginResponseDto> {
    return this.userService
      .login(await this.classMapper.mapAsync(userDto, UserDto, User))
      .then((loginResponse) => loginResponse)
      .catch((error) => {
        switch (error.name) {
          case 'InvalidEmailException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'EmailAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'InvalidPasswordException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'UserNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Post('/googleLogin')
  @UseInterceptors(MapInterceptor(LoginResponse, LoginResponseDto))
  async googleLogin(@Req() req): Promise<LoginResponseDto> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: req.body.token.toString(),
      });
      const payload = ticket.getPayload();
      return await this.userService.googleLogin(payload);
    } catch (error) {
      //agregar validaciones
      throw new HttpException('Login error.', 404);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/validate-authorization')
  async validateAuthorization(
    @Req() request: Request & { user: User },
  ): Promise<User> {
    return request.user;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async getUserById(
    @Param('id') userId: string,
    @I18n() i18n: I18nContext,
  ): Promise<UserDto> {
    return this.userService
      .findUserById(userId)
      .then((user) => user)
      .catch((error) => {
        switch (error.name) {
          case 'UserNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Post('/register')
  @UseInterceptors(MapInterceptor(User, UserDto))
  async createUser(
    @Body() createUserDto: UserDto,
    @I18n() i18n: I18nContext,
  ): Promise<UserDto> {
    return this.userService
      .createUser(await this.classMapper.mapAsync(createUserDto, UserDto, User))
      .then((user) => user)
      .catch((error) => {
        switch (error.name) {
          case 'InvalidEmailException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'EmailAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'InvalidPasswordException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    return this.userService
      .deleteUser(userId)
      .then((userDeleted) => !!userDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
