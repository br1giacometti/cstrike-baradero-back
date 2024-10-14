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

import PlayerService from '../../application/service/PlayerService';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import Player from 'Stock/domain/models/Player';
import { PlayerDto } from '../dto/Player/PlayerDto';
import { CreatePlayerDto } from '../dto/Player/CreatePlayerDto';

@Controller('player')
export default class PlayerController {
  constructor(
    private playerService: PlayerService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Player, PlayerDto, { isArray: true }))
  async getAllPlayers(): Promise<PlayerDto[]> {
    return this.playerService.fetchAllPlayers().then((players) => players);
  }

  @Get('/noteam')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Player, PlayerDto, { isArray: true }))
  async getAllPlayersNoTeam(): Promise<PlayerDto[]> {
    return this.playerService
      .fetchAllPlayersNoTeam()
      .then((players) => players);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/pagination')
  async getAllPagination(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('query') query: string,
    @Query('teamId') teamId: string,
  ): Promise<{ data: Player[]; meta: PaginationMetaDto }> {
    const [players, paginationMeta] = await this.playerService.getAllPagination(
      +page,
      +limit,
      query,
      teamId,
    );

    return { data: players, meta: paginationMeta };
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Player, PlayerDto))
  async login(
    @Body() playerDto: CreatePlayerDto,
    @I18n() i18n: I18nContext,
  ): Promise<PlayerDto> {
    return this.playerService
      .createPlayer(
        await this.classMapper.mapAsync(playerDto, CreatePlayerDto, Player),
      )
      .then((player) => player)
      .catch((error) => {
        switch (error.name) {
          case 'PlayerDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'PlayerSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(Player, PlayerDto))
  async getPlayerById(
    @Param('id') playerId: string,
    @I18n() i18n: I18nContext,
  ): Promise<PlayerDto> {
    return this.playerService
      .findPlayerById(parseInt(playerId))
      .then((player) => player)
      .catch((error) => {
        switch (error.name) {
          case 'PlayerNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'PlayerDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'PlayerSkuAlreadyInUseException': {
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
  @UseInterceptors(MapInterceptor(Player, PlayerDto))
  async updatePlayer(
    @Body() playerDto: PlayerDto,
    @Param('id') playerId: string,
    @I18n() i18n: I18nContext,
  ): Promise<PlayerDto> {
    return this.playerService
      .updatePlayer(
        parseInt(playerId),
        await this.classMapper.mapAsync(playerDto, CreatePlayerDto, Player),
      )
      .then((player) => player)
      .catch((error) => {
        switch (error.name) {
          case 'PlayerDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'PlayerSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'PlayerNotFoundException': {
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
  async deletePlayer(@Param('id') playerId: string): Promise<boolean> {
    return this.playerService
      .deletePlayer(parseInt(playerId))
      .then((playerDeleted) => !!playerDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/disconnect/:playerId')
  async disconnectTeamPlayer(
    @Param('playerId') playerId: string,
  ): Promise<boolean> {
    return this.playerService
      .disconnectPlayer(parseInt(playerId)) // Llama a tu método de servicio que se encarga de eliminar el jugador
      .then((playerDeleted) => !!playerDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/connect/:playerId/:teamId')
  async connectTeamPlayer(
    @Param('playerId') playerId: string,
    @Param('teamId') teamId: string,
  ): Promise<boolean> {
    return this.playerService
      .connectPlayer(parseInt(playerId), parseInt(teamId))
      .then(() => true)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
