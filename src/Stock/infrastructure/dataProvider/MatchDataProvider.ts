import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import MatchRepository from 'Stock/application/repository/MatchRepository';

import MatchNotFoundException from 'Stock/application/exception/MatchNotFoundException';
import Match from 'Stock/domain/models/Match';
import MatchEntity from '../entity/MatchEntity';
import { MatchDto } from '../dto/Match/MatchDto';
import { UpdateMatchDto } from '../dto/Match/UpdateMatchDto';

@Injectable()
export default class MatchDataProvider implements MatchRepository {
  client: Prisma.MatchDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.match;
  }

  async insert(match: Match): Promise<Match> {
    try {
      const matchEntity = await this.client.create({
        data: {
          tournament: { connect: { id: match.tournamentId } },
          teamA: { connect: { id: match.teamAId } },
          teamB: { connect: { id: match.teamBId } },
          matchDay: { connect: { id: match.matchDayId } },
          resultTeamA: match.resultTeamA ?? 0, // Asegúrate de incluir el valor o proporcionar un valor por defecto
          resultTeamB: match.resultTeamB ?? 0, // Lo mismo aquí
          map: match.map || '', // Proporciona un valor por defecto si es necesario
        },
        include: {
          tournament: true,
          teamA: true,
          teamB: true,
        },
      });

      return this.classMapper.mapAsync(matchEntity, MatchEntity, Match);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async findById(id: number): Promise<Match | null> {
    const matchEntity = await this.client.findUnique({
      where: { id },
      include: {
        tournament: true, // Incluye información del torneo
        teamA: true, // Incluye información del equipo A
        teamB: true, // Incluye información del equipo B
      },
    });
    return this.classMapper.mapAsync(matchEntity, MatchEntity, Match);
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[Match[], number]> {
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

    const matchs = await this.client.findMany({
      skip: skip,
      take: take,
      include: {
        tournament: true, // Incluye información del torneo
        teamA: true, // Incluye información del equipo A
        teamB: true, // Incluye información del equipo B
      },
      where,
    });
    const count = await this.client.count({ where });

    const mappedMatchs = await this.classMapper.mapArrayAsync(
      matchs,
      MatchEntity,
      Match,
    );
    return [mappedMatchs, count];
  }

  async findAll(): Promise<Match[]> {
    const matchs = await this.client.findMany({
      include: {
        tournament: true, // Incluye información del torneo
        teamA: { include: { players: true } },
        teamB: { include: { players: true } },
        matchStats: true,
      },
      orderBy: {
        id: 'asc', // Ordenar por descripción en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(matchs, MatchEntity, Match);
  }

  async delete(id: number): Promise<Match> {
    const matchEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(matchEntity, MatchEntity, Match);
  }

  async update(
    id: number,
    partialMatch: Partial<UpdateMatchDto>,
  ): Promise<Match> {
    try {
      const matchEntity = await this.client.update({
        where: { id },
        data: {
          map: partialMatch.map,
          resultTeamA: partialMatch.resultTeamA,
          resultTeamB: partialMatch.resultTeamB,
        },
        include: {
          tournament: true,
          teamA: true,
          teamB: true,
        },
      });

      return this.classMapper.mapAsync(matchEntity, MatchEntity, Match);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new MatchNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async validateMatchsIds(ids: number[]): Promise<Match[] | null> {
    const matchEntity = await this.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return this.classMapper.mapArrayAsync(matchEntity, MatchEntity, Match);
  }
}