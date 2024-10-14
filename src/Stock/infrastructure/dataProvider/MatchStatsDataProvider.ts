import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import MatchStatsRepository from 'Stock/application/repository/MatchStatsRepository';

import MatchStatsNotFoundException from 'Stock/application/exception/MatchStatsNotFoundException';
import MatchStats from 'Stock/domain/models/MatchStats';
import MatchStatsEntity from '../entity/MatchStatsEntity';

@Injectable()
export default class MatchStatsDataProvider implements MatchStatsRepository {
  client: Prisma.MatchStatsDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.matchStats;
  }

  async insert(matchstats: MatchStats): Promise<MatchStats> {
    try {
      const matchstatsEntity = await this.client.create({
        // Asegúrate de usar el nombre correcto del modelo
        data: {
          match: { connect: { id: matchstats.matchId } },
          player: { connect: { id: matchstats.playerId } },
          team: { connect: { id: matchstats.teamId } }, // Asegúrate de tener el teamId aquí
          kills: matchstats.kills,
          deaths: matchstats.deaths,
        },
        include: { player: true, team: true }, // Incluye el equipo si es necesario
      });

      return this.classMapper.mapAsync(
        matchstatsEntity,
        MatchStatsEntity,
        MatchStats,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async findById(id: number): Promise<MatchStats | null> {
    const matchstatsEntity = await this.client.findUnique({
      where: { id },
      include: { team: true },
    });
    return this.classMapper.mapAsync(
      matchstatsEntity,
      MatchStatsEntity,
      MatchStats,
    );
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[MatchStats[], number]> {
    query = query == undefined ? '' : query;

    const where: any = {
      AND: [
        {
          OR: [
            { description: { contains: query, mode: 'insensitive' } },
            { barCode: { contains: query, mode: 'insensitive' } },
          ],
        },
        categoryId ? { categoryId: { equals: parseInt(categoryId) } } : {},
      ],
    };

    const matchstatss = await this.client.findMany({
      skip: skip,
      take: take,
      include: {
        team: true,
      },
      where,
    });
    const count = await this.client.count({ where });

    const mappedMatchStatss = await this.classMapper.mapArrayAsync(
      matchstatss,
      MatchStatsEntity,
      MatchStats,
    );
    return [mappedMatchStatss, count];
  }

  async findAll(): Promise<MatchStats[]> {
    const matchstatss = await this.client.findMany({
      include: { team: true, player: true },
      orderBy: {
        kills: 'desc', // Ordenar por descripción en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(
      matchstatss,
      MatchStatsEntity,
      MatchStats,
    );
  }

  async findTop10Players(): Promise<MatchStats[]> {
    const matchstatss = await this.client.findMany({
      include: { team: true, player: true },
      orderBy: {
        kills: 'desc', // Ordenar por descripción en orden ascendente
      },
      take: 10,
    });

    return this.classMapper.mapArrayAsync(
      matchstatss,
      MatchStatsEntity,
      MatchStats,
    );
  }

  async delete(id: number): Promise<MatchStats> {
    const matchstatsEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(
      matchstatsEntity,
      MatchStatsEntity,
      MatchStats,
    );
  }

  async update(
    id: number,
    partialMatchStats: Partial<MatchStats>,
  ): Promise<MatchStats> {
    try {
      const matchstatsEntity = await this.client.update({
        data: {
          deaths: partialMatchStats.deaths,
        },
        include: { team: true },
        where: {
          id,
        },
      });
      return this.classMapper.mapAsync(
        matchstatsEntity,
        MatchStatsEntity,
        MatchStats,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new MatchStatsNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async validateMatchStatssIds(ids: number[]): Promise<MatchStats[] | null> {
    const matchstatsEntity = await this.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return this.classMapper.mapArrayAsync(
      matchstatsEntity,
      MatchStatsEntity,
      MatchStats,
    );
  }
}
