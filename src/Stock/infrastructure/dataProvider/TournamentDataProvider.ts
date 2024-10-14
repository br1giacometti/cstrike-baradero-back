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

  async getPointsByTournamentId(tournamentId: number): Promise<
    Array<{
      idEquipo: number;
      nombreEquipo: string;
      victoriasTotales: number;
      derrotasTotales: number;
      puntuacionTotal: number;
    }>
  > {
    // Obtener el torneo y los partidos
    const tournamentEntity = await this.client.findUnique({
      where: { id: tournamentId },
      include: {
        teams: true,
        matches: true,
      },
    });

    // Verificar si el torneo existe
    if (!tournamentEntity) {
      throw new Error('Tournament not found');
    }

    // Inicializar un mapa para almacenar estadísticas de equipos
    const teamStats = new Map<
      number,
      { wins: number; losses: number; points: number }
    >();

    // Inicializar las estadísticas para cada equipo
    for (const team of tournamentEntity.teams) {
      teamStats.set(team.id, { wins: 0, losses: 0, points: 0 });
    }

    // Recorrer los partidos y calcular puntos
    for (const match of tournamentEntity.matches) {
      const { resultTeamA, resultTeamB, teamAId, teamBId } = match;

      if (resultTeamA > resultTeamB) {
        // Equipo A gana
        teamStats.get(teamAId)!.wins++;
        teamStats.get(teamAId)!.points += 3; // Ganador recibe 3 puntos
        teamStats.get(teamBId)!.losses++;
      } else if (resultTeamA < resultTeamB) {
        // Equipo B gana
        teamStats.get(teamBId)!.wins++;
        teamStats.get(teamBId)!.points += 3; // Ganador recibe 3 puntos
        teamStats.get(teamAId)!.losses++;
      } else {
        // No hay empates según tu lógica
        continue;
      }
    }

    // Crear el resultado final
    const result = tournamentEntity.teams.map((team) => {
      const stats = teamStats.get(team.id);
      return {
        idEquipo: team.id,
        nombreEquipo: team.name,
        victoriasTotales: stats!.wins,
        derrotasTotales: stats!.losses,
        puntuacionTotal: stats!.points,
      };
    });

    return result;
  }

  async findById(id: number): Promise<Tournament | null> {
    const tournamentEntity = await this.client.findUnique({
      where: { id },
      include: {
        teams: true,
        MatchDay: true,
        matches: {
          include: {
            matchStats: {
              include: { player: true },
              orderBy: [
                { teamId: 'asc' }, // Ordenar primero por teamId
                { kills: 'desc' }, // Luego ordenar por kills en orden descendente
              ],
            },
          },
        },
        scoreTables: true,
      },
    });

    if (!tournamentEntity) {
      return null;
    }

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
      where: {
        isActive: true, // Filtrar solo torneos activos
      },
      include: {
        teams: true,
        matches: {
          include: {
            matchStats: {
              orderBy: [
                { teamId: 'asc' }, // Primero ordenamos por teamId
                { kills: 'desc' }, // Luego ordenamos por kills en orden descendente
              ],
            },
          },
        },
        scoreTables: true,
      },
      orderBy: {
        createdAt: 'desc', // Ordenar por createdAt en orden ascendente para obtener el más viejo
      },
    });

    return this.classMapper.mapArrayAsync(
      tournaments,
      TournamentEntity,
      Tournament,
    );
  }

  async findFixture(): Promise<Tournament[]> {
    const tournaments = await this.client.findMany({
      where: {
        isActive: true, // Filtrar solo torneos activos
      },
      include: {
        matches: {
          include: {
            teamA: { include: { players: true } },
            teamB: { include: { players: true } },
          },
        },
        MatchDay: true,
      },
      orderBy: {
        createdAt: 'asc', // Ordenar por createdAt en orden ascendente para obtener el más viejo
      },
      take: 1,
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
