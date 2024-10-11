import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import TournamentRepository from 'Stock/application/repository/TournamentRepository';

import TournamentNotFoundException from 'Stock/application/exception/TournamentNotFoundException';
import Tournament from 'Stock/domain/models/Tournament';
import TournamentEntity from '../entity/TournamentEntity';

@Injectable()
export default class TournamentDataProvider implements TournamentRepository {
  client: Prisma.TournamentDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.tournament;
  }

  async findTournamentByDescription(name: string): Promise<Tournament | null> {
    const tournamentEntity = await this.client.findUnique({
      where: { name },
    });
    return this.classMapper.mapAsync(
      tournamentEntity,
      TournamentEntity,
      Tournament,
    );
  }

  async insert(tournament: Tournament): Promise<Tournament> {
    try {
      const tournamentEntity = await this.client.create({
        data: {
          name: tournament.name,
          startDate: new Date(),
          createdAt: new Date(),
          teams: {
            connect: tournament.teams.map((team) => ({ id: team.id })),
          },
        },
        include: {
          teams: true,
        },
      });

      return this.classMapper.mapAsync(
        tournamentEntity,
        TournamentEntity,
        Tournament,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async findById(id: number): Promise<Tournament | null> {
    const tournamentEntity = await this.client.findUnique({
      where: { id },
      include: { teams: true, matches: true, scoreTables: true },
    });
    return this.classMapper.mapAsync(
      tournamentEntity,
      TournamentEntity,
      Tournament,
    );
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[Tournament[], number]> {
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

    const tournaments = await this.client.findMany({
      skip: skip,
      take: take,
      include: { teams: true, matches: true, scoreTables: true },
      where,
    });
    const count = await this.client.count({ where });

    const mappedTournaments = await this.classMapper.mapArrayAsync(
      tournaments,
      TournamentEntity,
      Tournament,
    );
    return [mappedTournaments, count];
  }

  async findAll(): Promise<Tournament[]> {
    const tournaments = await this.client.findMany({
      include: { teams: true, matches: true, scoreTables: true },
      orderBy: {
        createdAt: 'desc', // Ordenar por descripción en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(
      tournaments,
      TournamentEntity,
      Tournament,
    );
  }

  async delete(id: number): Promise<Tournament> {
    const tournamentEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(
      tournamentEntity,
      TournamentEntity,
      Tournament,
    );
  }

  async update(
    id: number,
    partialTournament: Partial<Tournament>,
  ): Promise<Tournament> {
    try {
      const tournamentEntity = await this.client.update({
        where: { id },
        data: {
          name: partialTournament.name,
        },
        include: { teams: true, matches: true, scoreTables: true },
      });
      return this.classMapper.mapAsync(
        tournamentEntity,
        TournamentEntity,
        Tournament,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new TournamentNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    }
  }

  async validateTournamentsIds(ids: number[]): Promise<Tournament[] | null> {
    const tournamentEntity = await this.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return this.classMapper.mapArrayAsync(
      tournamentEntity,
      TournamentEntity,
      Tournament,
    );
  }
}
