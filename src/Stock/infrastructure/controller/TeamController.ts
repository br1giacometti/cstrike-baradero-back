import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';
import TeamService from 'Stock/application/service/TeamService';
import Team from 'Stock/domain/models/Team';
import { TeamDto } from '../dto/Team/TeamDto';
import { CreateTeamDto } from '../dto/Team/CreateTeamDto';
import { UpdateTeamDto } from '../dto/Team/UpdateTeamDto';

@Controller('team')
export default class TeamController {
  constructor(
    private teamService: TeamService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  @UseInterceptors(MapInterceptor(Team, TeamDto, { isArray: true }))
  async getAllTeamss(): Promise<TeamDto[]> {
    return this.teamService.fetchAllTeams().then((team) => team);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Team, TeamDto))
  async getTeamById(
    @Param('id') teamId: string,
    @I18n() i18n: I18nContext,
  ): Promise<TeamDto> {
    return this.teamService
      .findTeamById(parseInt(teamId))
      .then((team) => team)
      .catch((error) => {
        switch (error.name) {
          case 'TeamNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Team, TeamDto))
  async login(@Body() teamDto: CreateTeamDto): Promise<TeamDto> {
    return this.teamService
      .createTeam(await this.mapper.mapAsync(teamDto, CreateTeamDto, Team))
      .then((team) => team)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Team, TeamDto))
  async updateTeam(
    @Body() updateTeamDto: UpdateTeamDto,
    @Param('id') teamId: string,
    @I18n() i18n: I18nContext,
  ): Promise<TeamDto> {
    return this.teamService
      .updateTeam(
        parseInt(teamId),
        await this.mapper.mapAsync(updateTeamDto, UpdateTeamDto, Team),
      )
      .then((team) => team)
      .catch((error) => {
        switch (error.name) {
          case 'TeamNotFoundException': {
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
  async deleteTeam(@Param('id') teamId: number): Promise<boolean> {
    return this.teamService
      .deleteTeam(teamId)
      .then((teamDeleted) => !!teamDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
