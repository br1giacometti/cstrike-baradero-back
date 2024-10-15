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

import TournamentService from '../../application/service/TournamentService';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import Tournament from 'Stock/domain/models/Tournament';
import { TournamentDto } from '../dto/Tournament/TournamentDto';
import { CreateTournamentDto } from '../dto/Tournament/CreateTournamentDto';

@Controller('tournament')
export default class TournamentController {
  constructor(
    private tournamentService: TournamentService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto, { isArray: true }))
  async getAllTournaments(): Promise<TournamentDto[]> {
    return this.tournamentService
      .fetchAllTournaments()
      .then((tournaments) => tournaments);
  }

  @Get('/semiresults')
  async getSemiResults(): Promise<
    Array<{
      teamAId: number;
      teamBId: number;
      resultA: number;
      resultB: number;
    }>
  > {
    return this.tournamentService.getSemiResults().then((points) => points);
  }

  @Get('/fixture')
  async getLastAtiveTournaments(): Promise<TournamentDto[]> {
    return this.tournamentService
      .fetchFixtureActiveTournament()
      .then((tournaments) => tournaments);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/pagination')
  async getAllPagination(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('query') query: string,
    @Query('categoryId') categoryId: string,
  ): Promise<{ data: Tournament[]; meta: PaginationMetaDto }> {
    const [tournaments, paginationMeta] =
      await this.tournamentService.getAllPagination(
        +page,
        +limit,
        query,
        categoryId,
      );

    return { data: tournaments, meta: paginationMeta };
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  async login(
    @Body() tournamentDto: CreateTournamentDto,
    @I18n() i18n: I18nContext,
  ): Promise<TournamentDto> {
    return this.tournamentService
      .createTournament(
        await this.classMapper.mapAsync(
          tournamentDto,
          CreateTournamentDto,
          Tournament,
        ),
      )
      .then((tournament) => tournament)
      .catch((error) => {
        switch (error.name) {
          case 'TournamentDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'TournamentSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  async getTournamentById(
    @Param('id') tournamentId: string,
    @I18n() i18n: I18nContext,
  ): Promise<TournamentDto> {
    return this.tournamentService
      .findTournamentById(parseInt(tournamentId))
      .then((tournament) => tournament)
      .catch((error) => {
        switch (error.name) {
          case 'TournamentNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'TournamentDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'TournamentSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Get('/points/:id')
  async getPointsByTournamentId(@I18n() i18n: I18nContext): Promise<
    Array<{
      idEquipo: number;
      nombreEquipo: string;
      victoriasTotales: number;
      derrotasTotales: number;
      puntuacionTotal: number;
    }>
  > {
    return this.tournamentService
      .getPointsByTournamentId()
      .then((points) => points)
      .catch((error) => {
        switch (error.name) {
          case 'TournamentNotFoundException': {
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
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  async updateTournament(
    @Body() tournamentDto: TournamentDto,
    @Param('id') tournamentId: string,
    @I18n() i18n: I18nContext,
  ): Promise<TournamentDto> {
    return this.tournamentService
      .updateTournament(
        parseInt(tournamentId),
        await this.classMapper.mapAsync(
          tournamentDto, // No necesitas cambiar esto
          TournamentDto, // Cambia a TournamentDto
          Tournament, // El modelo de destino sigue siendo Tournament
        ),
      )
      .then((tournament) => tournament)
      .catch((error) => {
        switch (error.name) {
          case 'TournamentDescriptionAlreadyInUseException':
            throw new HttpException(i18n.t(error.message), 404);
          case 'TournamentSkuAlreadyInUseException':
            throw new HttpException(i18n.t(error.message), 404);
          case 'TournamentNotFoundException':
            throw new HttpException(i18n.t(error.message), 404);
          default:
            throw new HttpException(error.message, 500);
        }
      });
  }

  @Patch('/updatestage/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  async updateTournamentStage(
    @Body() tournamentDto: TournamentDto,
    @Param('id') tournamentId: string,
    @I18n() i18n: I18nContext,
  ): Promise<TournamentDto> {
    return this.tournamentService
      .updateTournamentStage(
        parseInt(tournamentId),
        await this.classMapper.mapAsync(
          tournamentDto, // No necesitas cambiar esto
          TournamentDto, // Cambia a TournamentDto
          Tournament, // El modelo de destino sigue siendo Tournament
        ),
      )
      .then((tournament) => tournament)
      .catch((error) => {
        switch (error.name) {
          case 'TournamentDescriptionAlreadyInUseException':
            throw new HttpException(i18n.t(error.message), 404);
          case 'TournamentSkuAlreadyInUseException':
            throw new HttpException(i18n.t(error.message), 404);
          case 'TournamentNotFoundException':
            throw new HttpException(i18n.t(error.message), 404);
          default:
            throw new HttpException(error.message, 500);
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteTournament(@Param('id') tournamentId: string): Promise<boolean> {
    return this.tournamentService
      .deleteTournament(parseInt(tournamentId))
      .then((tournamentDeleted) => !!tournamentDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
