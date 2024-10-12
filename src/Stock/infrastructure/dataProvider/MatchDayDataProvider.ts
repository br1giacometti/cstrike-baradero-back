import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import MatchDay from 'Stock/domain/models/MatchDay';
import MatchDayEntity from '../entity/MatchDayEntity';
import MatchDayRepository from 'Stock/application/repository/MatchRepository copy';
import { UpdateMatchDayDto } from '../dto/MatchDay/UpdateDayMatchDto';
import MatchStatsNotFoundException from 'Stock/application/exception/MatchStatsNotFoundException';

@Injectable()
export default class MatchDayDataProvider implements MatchDayRepository {
  client: Prisma.MatchDayDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.matchDay;
  }

  async insert(matchday: MatchDay): Promise<MatchDay> {
    try {
      const matchdayEntity = await this.client.create({
        data: {
          tournamentId: matchday.tournamentId,
          name: matchday.name,
        },
      });

      return this.classMapper.mapAsync(
        matchdayEntity,
        MatchDayEntity,
        MatchDay,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async findById(id: number): Promise<MatchDay | null> {
    const matchdayEntity = await this.client.findUnique({
      where: { id },
    });
    return this.classMapper.mapAsync(matchdayEntity, MatchDayEntity, MatchDay);
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[MatchDay[], number]> {
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

    const matchdays = await this.client.findMany({
      skip: skip,
      take: take,

      where,
    });
    const count = await this.client.count({ where });

    const mappedMatchDays = await this.classMapper.mapArrayAsync(
      matchdays,
      MatchDayEntity,
      MatchDay,
    );
    return [mappedMatchDays, count];
  }

  async findAll(): Promise<MatchDay[]> {
    const matchdays = await this.client.findMany({
      orderBy: {
        id: 'asc', // Ordenar por descripción en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(matchdays, MatchDayEntity, MatchDay);
  }

  async delete(id: number): Promise<MatchDay> {
    const matchdayEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(matchdayEntity, MatchDayEntity, MatchDay);
  }

  async update(
    id: number,
    partialMatchDay: Partial<UpdateMatchDayDto>,
  ): Promise<MatchDay> {
    try {
      const matchdayEntity = await this.client.update({
        where: { id },
        data: {
          name: partialMatchDay.name,
        },
      });

      return this.classMapper.mapAsync(
        matchdayEntity,
        MatchDayEntity,
        MatchDay,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new MatchStatsNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async validateMatchDaysIds(ids: number[]): Promise<MatchDay[] | null> {
    const matchdayEntity = await this.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return this.classMapper.mapArrayAsync(
      matchdayEntity,
      MatchDayEntity,
      MatchDay,
    );
  }
}
