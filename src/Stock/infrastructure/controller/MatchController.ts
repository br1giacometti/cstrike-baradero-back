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

import MatchService from '../../application/service/MatchService';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import Match from 'Stock/domain/models/Match';
import { MatchDto } from '../dto/Match/MatchDto';
import { CreateMatchDto } from '../dto/Match/CreateMatchDto';
import { UpdateMatchDto } from '../dto/Match/UpdateMatchDto';

@Controller('match')
export default class MatchController {
  constructor(
    private matchService: MatchService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Match, MatchDto, { isArray: true }))
  async getAllMatchs(): Promise<MatchDto[]> {
    return this.matchService.fetchAllMatchs().then((matchs) => matchs);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/pagination')
  async getAllPagination(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('query') query: string,
    @Query('categoryId') categoryId: string,
  ): Promise<{ data: Match[]; meta: PaginationMetaDto }> {
    const [matchs, paginationMeta] = await this.matchService.getAllPagination(
      +page,
      +limit,
      query,
      categoryId,
    );

    return { data: matchs, meta: paginationMeta };
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Match, MatchDto))
  async login(
    @Body() matchDto: CreateMatchDto,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDto> {
    return this.matchService
      .createMatch(
        await this.classMapper.mapAsync(matchDto, CreateMatchDto, Match),
      )
      .then((match) => match)
      .catch((error) => {
        switch (error.name) {
          case 'MatchDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(Match, MatchDto))
  async getMatchById(
    @Param('id') matchId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDto> {
    return this.matchService
      .findMatchById(parseInt(matchId))
      .then((match) => match)
      .catch((error) => {
        switch (error.name) {
          case 'MatchNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Get('/filter/:matchid/:teamid')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Match, MatchDto, { isArray: true }))
  async getAllMatchById(
    @Param('matchid') matchId: string,
    @Param('teamid') teamId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDto[]> {
    return this.matchService
      .fetchAllMatchsById(parseInt(matchId), parseInt(teamId))
      .then((matchs) => matchs)
      .catch((error) => {
        switch (error.name) {
          case 'MatchNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'MatchSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(Match, MatchDto))
  async updateMatch(
    @Body() matchDto: UpdateMatchDto, // Se asegura de que sea UpdateMatchDto
    @Param('id') matchId: string,
    @I18n() i18n: I18nContext,
  ): Promise<MatchDto> {
    // Realiza el mapeo de matchDto a Match
    const match = await this.classMapper.mapAsync(
      matchDto,
      UpdateMatchDto,
      Match, // Verifica que Match sea el tipo correcto
    );

    return this.matchService
      .updateMatch(parseInt(matchId), match)
      .then((updatedMatch) => updatedMatch)
      .catch((error) => {
        switch (error.name) {
          case 'MatchNotFoundException':
            throw new HttpException(i18n.t(error.message), 404);
          default:
            throw new HttpException(error.message, 500);
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMatch(@Param('id') matchId: string): Promise<boolean> {
    return this.matchService
      .deleteMatch(parseInt(matchId))
      .then((matchDeleted) => !!matchDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
