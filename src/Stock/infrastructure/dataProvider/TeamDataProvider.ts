import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import TeamRepository from 'Stock/application/repository/TeamRepository';
import Team from 'Stock/domain/models/Team';

import TeamDescriptionAlreadyInUseException from 'Stock/application/exception/TeamDescriptionAlreadyInUseException';
import TeamNotFoundException from 'Stock/application/exception/TeamNotFoundException';
import TeamEntity from '../entity/TeamEntity';

@Injectable()
export default class TeamDataProvider implements TeamRepository {
  client: Prisma.TeamDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.team;
  }

  findTeamByDescription: (description: string) => Promise<Team>;

  async insert(team: Team): Promise<Team> {
    try {
      const teamEntity = await this.client.create({
        data: {
          name: team.name,
        },
        include: { players: true },
      });

      return this.classMapper.mapAsync(teamEntity, TeamEntity, Team);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new TeamDescriptionAlreadyInUseException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async findById(id: number): Promise<Team | null> {
    const teamEntity = await this.client.findUnique({
      where: { id },
      include: { players: true },
    });
    return this.classMapper.mapAsync(teamEntity, TeamEntity, Team);
  }

  async findAll(): Promise<Team[]> {
    const teames = await this.client.findMany({ include: { players: true } });
    return this.classMapper.mapArrayAsync(teames, TeamEntity, Team);
  }

  async delete(id: number): Promise<Team> {
    const teamEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(teamEntity, TeamEntity, Team);
  }

  async update(id: number, partialTeam: Partial<Team>): Promise<Team> {
    try {
      const teamEntity = await this.client.update({
        data: {
          name: partialTeam.name,
        },
        where: {
          id,
        },
        include: { players: true },
      });
      return this.classMapper.mapAsync(teamEntity, TeamEntity, Team);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new TeamNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }
}
