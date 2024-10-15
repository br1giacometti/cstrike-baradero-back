import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import TournamentRepository from 'Stock/application/repository/TournamentRepository';

import TournamentNotFoundException from 'Stock/application/exception/TournamentNotFoundException';
import Tournament from 'Stock/domain/models/Tournament';
import TournamentEntity from '../entity/TournamentEntity';
import { TournamentStage } from 'Stock/domain/models/TournamentStage';
import MatchDay from 'Stock/domain/models/MatchDay';

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

  async findStatusId(): Promise<TournamentStage | null> {
    const tournament = await this.client.findFirst({
      where: {
        isActive: true, // Filtrar solo torneos activos
      },
      select: {
        status: true, // Solo traemos el campo 'status'
      },
      orderBy: {
        createdAt: 'asc', // Ordenar por createdAt en orden ascendente
      },
    });

    if (!tournament) {
      return null; // Retornar null si no hay torneo activo
    }

    return tournament.status as TournamentStage; // Type assertion para resolver el conflicto
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

  async getPointsByTournamentId(): Promise<
    Array<{
      idEquipo: number;
      nombreEquipo: string;
      victoriasTotales: number;
      derrotasTotales: number;
      puntuacionTotal: number;
    }>
  > {
    const tournaments = await this.client.findMany({
      where: {
        isActive: true,
      },
      include: {
        teams: true,
        matches: {
          include: {
            teamA: { include: { players: true } },
            teamB: { include: { players: true } },
            matchDay: true,
          },
        },
        MatchDay: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 1,
    });

    if (tournaments.length === 0) {
      throw new Error('No active tournaments found');
    }

    const tournamentEntity = tournaments[0];
    const teamStats = new Map<
      number,
      { wins: number; losses: number; points: number }
    >();

    for (const team of tournamentEntity.teams) {
      teamStats.set(team.id, { wins: 0, losses: 0, points: 0 });
    }

    for (const match of tournamentEntity.matches) {
      const { resultTeamA, resultTeamB, teamAId, teamBId, matchDay } = match;

      // Verifica si el nombre de la jornada no es una de las fases finales
      if (
        matchDay.name !== 'Semifinal 1' &&
        matchDay.name !== 'Semifinal 2' &&
        matchDay.name !== 'Final' &&
        matchDay.name !== 'Tercer y Cuarto Puesto'
      ) {
        if (resultTeamA > resultTeamB) {
          // Equipo A gana
          teamStats.get(teamAId)!.wins++;
          if (resultTeamA === 16) {
            // Gana con 16 puntos
            teamStats.get(teamAId)!.points += 3; // 3 puntos
          } else if (resultTeamA > 17) {
            // Gana con más de 17 puntos
            teamStats.get(teamAId)!.points += 2; // 2 puntos
          }
          teamStats.get(teamBId)!.losses++;
          if (resultTeamB > 12 || resultTeamB >= 15) {
            // Si el perdedor tiene más de 12 o 15 puntos
            teamStats.get(teamBId)!.points += 1; // 1 punto
          }
        } else if (resultTeamA < resultTeamB) {
          // Equipo B gana
          teamStats.get(teamBId)!.wins++;
          if (resultTeamB === 16) {
            // Gana con 16 puntos
            teamStats.get(teamBId)!.points += 3; // 3 puntos
          } else if (resultTeamB > 17) {
            // Gana con más de 17 puntos
            teamStats.get(teamBId)!.points += 2; // 2 puntos
          }
          teamStats.get(teamAId)!.losses++;
          if (resultTeamA > 12 || resultTeamA >= 15) {
            // Si el perdedor tiene más de 12 o 15 puntos
            teamStats.get(teamAId)!.points += 1; // 1 punto
          }
        }
      }
    }

    const result = tournamentEntity.teams.map((team) => {
      const stats = teamStats.get(team.id) || { wins: 0, losses: 0, points: 0 };
      return {
        idEquipo: team.id,
        nombreEquipo: team.name,
        victoriasTotales: stats.wins,
        derrotasTotales: stats.losses,
        puntuacionTotal: stats.points,
      };
    });

    return result.sort((a, b) => b.puntuacionTotal - a.puntuacionTotal);
  }

  async getSemiFinalResults(idTournament: number): Promise<
    Array<{
      teamAId: number;
      teamBId: number;
      resultA: number;
      resultB: number;
    }>
  > {
    const tournament = await this.client.findUnique({
      where: { id: idTournament },
      include: {
        matches: {
          where: {
            // Filtra los partidos que pertenecen a la etapa de semifinales
            matchDay: {
              name: {
                in: ['Semifinal 1', 'Semifinal 2'], // Usa 'in' para filtrar por múltiples nombres
              },
            },
          },
          include: {
            teamA: true,
            teamB: true,
          },
        },
      },
    });

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    const results = tournament.matches.map((match) => ({
      teamAId: match.teamAId,
      teamBId: match.teamBId,
      resultA: match.resultTeamA,
      resultB: match.resultTeamB,
    }));

    return results;
  }

  async findNextMatchDayWithMatches(): Promise<MatchDay[]> {
    const tournaments = await this.client.findMany({
      where: { isActive: true },
      include: {
        MatchDay: {
          orderBy: { id: 'asc' }, // Ordenar los matchDays por id ascendente
          include: {
            matches: {
              include: {
                teamA: { include: { players: true } },
                teamB: { include: { players: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' }, // Obtener el torneo más viejo
      take: 1,
    });

    const tournament = tournaments[0];
    if (!tournament) return [];

    // Filtrar los MatchDays que tengan al menos un partido sin jugar
    const pendingMatchDays = tournament.MatchDay.filter((matchDay) =>
      matchDay.matches.some(
        (match) => match.resultTeamA === 0 && match.resultTeamB === 0,
      ),
    );

    return pendingMatchDays; // Devolver todos los matchDays con partidos pendientes
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
            matchDay: true,
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
          status: partialTournament.status,
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
