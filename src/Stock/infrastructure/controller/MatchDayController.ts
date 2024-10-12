import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import MatchDayService from '../../application/service/MatchDayService';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import MatchDay from 'Stock/domain/models/MatchDay';
import { MatchDayDto } from '../dto/MatchDay/MatchDayDto';
import { CreateMatchDayDto } from '../dto/MatchDay/CreateMatchDayDto';
import { UpdateMatchDayDto } from '../dto/MatchDay/UpdateDayMatchDto';

@Controller('matchday')
export default class MatchDayController {
  constructor(
    private matchdayService: MatchDayService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(MatchDay, MatchDayDto, { isArray: true }))
  async getAllMatchDays(): Promise<MatchDayDto[]> {
    return this.matchdayService
      .fetchAllMatchDays()
      .then((matchdays) => matchdays);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(MatchDay, MatchDayDto))
  async login(
    @Body() matchdayDto: CreateMatchDayDto,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDayDto> {
    return this.matchdayService
      .createMatchDay(
        await this.classMapper.mapAsync(
          matchdayDto,
          CreateMatchDayDto,
          MatchDay,
        ),
      )
      .then((matchday) => matchday)
      .catch((error) => {
        switch (error.name) {
          case 'MatchDayDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchDaySkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(MatchDay, MatchDayDto))
  async getMatchDayById(
    @Param('id') matchdayId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDayDto> {
    return this.matchdayService
      .findMatchDayById(parseInt(matchdayId))
      .then((matchday) => matchday)
      .catch((error) => {
        switch (error.name) {
          case 'MatchDayNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchDayDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchDaySkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(MatchDay, MatchDayDto))
  async updateMatchDay(
    @Body() matchdayDto: UpdateMatchDayDto, // Se asegura de que sea UpdateMatchDayDto
    @Param('id') matchdayId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDayDto> {
    // Realiza el mapeo de matchdayDto a MatchDay
    const matchday = await this.classMapper.mapAsync(
      matchdayDto,
      UpdateMatchDayDto,
      MatchDay, // Verifica que MatchDay sea el tipo correcto
    );

    return this.matchdayService
      .updateMatchDay(parseInt(matchdayId), matchday)
      .then((updatedMatchDay) => updatedMatchDay)
      .catch((error) => {
        switch (error.name) {
          case 'MatchDayNotFoundException':
            throw new HttpException(i18n.t(error.message), 404);
          default:
            throw new HttpException(error.message, 500);
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMatchDay(@Param('id') matchdayId: string): Promise<boolean> {
    return this.matchdayService
      .deleteMatchDay(parseInt(matchdayId))
      .then((matchdayDeleted) => !!matchdayDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
