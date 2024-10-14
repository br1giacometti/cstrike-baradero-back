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

import MatchStatsService from '../../application/service/MatchStatsService';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import MatchStats from 'Stock/domain/models/MatchStats';
import { MatchStatsDto } from '../dto/MatchStats/MatchStatsDto';
import { CreateMatchStatsDto } from '../dto/MatchStats/CreateMatchStatsDto';

@Controller('matchstats')
export default class MatchStatsController {
  constructor(
    private matchstatsService: MatchStatsService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @UseInterceptors(MapInterceptor(MatchStats, MatchStatsDto, { isArray: true }))
  async getAllMatchStatss(): Promise<MatchStatsDto[]> {
    return this.matchstatsService
      .fetchAllMatchStatss()
      .then((matchstatss) => matchstatss);
  }

  @Get('/top10')
  @UseInterceptors(MapInterceptor(MatchStats, MatchStatsDto, { isArray: true }))
  async getTop10Players(): Promise<MatchStatsDto[]> {
    return this.matchstatsService
      .fetchTop10Players()
      .then((matchstatss) => matchstatss);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(MatchStats, MatchStatsDto))
  async login(
    @Body() matchstatsDto: CreateMatchStatsDto,
    @I18n() i18n: I18nContext,
  ): Promise<MatchStatsDto> {
    return this.matchstatsService
      .createMatchStats(
        await this.classMapper.mapAsync(
          matchstatsDto,
          CreateMatchStatsDto,
          MatchStats,
        ),
      )
      .then((matchstats) => matchstats)
      .catch((error) => {
        switch (error.name) {
          case 'MatchStatsDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchStatsSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(MatchStats, MatchStatsDto))
  async getMatchStatsById(
    @Param('id') matchstatsId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchStatsDto> {
    return this.matchstatsService
      .findMatchStatsById(parseInt(matchstatsId))
      .then((matchstats) => matchstats)
      .catch((error) => {
        switch (error.name) {
          case 'MatchStatsNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchStatsDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchStatsSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(MatchStats, MatchStatsDto))
  async updateMatchStats(
    @Body() matchstatsDto: MatchStatsDto,
    @Param('id') matchstatsId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchStatsDto> {
    return this.matchstatsService
      .updateMatchStats(
        parseInt(matchstatsId),
        await this.classMapper.mapAsync(
          matchstatsDto,
          CreateMatchStatsDto,
          MatchStats,
        ),
      )
      .then((matchstats) => matchstats)
      .catch((error) => {
        switch (error.name) {
          case 'MatchStatsDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchStatsSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchStatsNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMatchStats(@Param('id') matchstatsId: string): Promise<boolean> {
    return this.matchstatsService
      .deleteMatchStats(parseInt(matchstatsId))
      .then((matchstatsDeleted) => !!matchstatsDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
