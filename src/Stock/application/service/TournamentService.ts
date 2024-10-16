import { Injectable } from '@nestjs/common';

import Tournament from '../../domain/models/Tournament';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import TournamentRepository from '../repository/TournamentRepository';
import TournamentValidations from '../validations/TournamentValidations';
import MatchDayService from './MatchDayService';
import MatchDay from 'Stock/domain/models/MatchDay';

@Injectable()
export default class TournamentService {
  constructor(
    private readonly repository: TournamentRepository,
    private readonly validator: TournamentValidations,
    private readonly matchDayService: MatchDayService,
  ) {}

  async createTournament(tournament: Tournament): Promise<Tournament> {
    const tournamentCreated = await this.repository.insert({
      name: tournament.name,
      matches: tournament.matches,
      status: tournament.status,
      scoreTables: tournament.scoreTables,
      startDate: tournament.startDate,
      teams: tournament.teams,
      endDate: tournament.endDate,
      id: tournament.id,
      createdAt: new Date(),
    });
    return tournamentCreated;
  }

  async updateTournament(
    id: number,
    tournament: Tournament,
  ): Promise<Tournament> {
    const tournamentUpdated = await this.repository.update(id, {
      name: tournament.name,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      matches: tournament.matches,
      scoreTables: tournament.scoreTables,
      teams: tournament.teams,
    });
    return tournamentUpdated;
  }

  async updateTournamentStage(
    idTournament: number,
    tournament: Tournament,
  ): Promise<Tournament> {
    if (tournament.status === 'SEMIFINALS') {
      const topTeams = await this.repository.getPointsByTournamentId();

      // Separar los equipos en dos enfrentamientos
      const semiFinal1 = {
        teamAId: topTeams[0].idEquipo, // 1º lugar
        teamBId: topTeams[3].idEquipo, // 4º lugar
      };

      const semiFinal2 = {
        teamAId: topTeams[1].idEquipo, // 2º lugar
        teamBId: topTeams[2].idEquipo, // 3º lugar
      };

      const firstMatchDay = new MatchDay(idTournament, 'Semi Finales 1');

      await this.matchDayService.createMatchDayStage(
        firstMatchDay,
        semiFinal1,
        'Semifinal 1',
      );

      await this.matchDayService.createMatchDayStage(
        firstMatchDay,
        semiFinal2,
        'Semifinal 2',
      );

      // Aquí podrías actualizar el estado del torneo a SEMIFINALS
      await this.repository.update(idTournament, {
        status: tournament.status,
      });
    } else if (tournament.status === 'FINAL') {
      // Obtener los resultados de las semifinales
      const semiFinalResults = await this.repository.getSemiFinalResults(
        idTournament,
      );

      // Crear un objeto para llevar el conteo de victorias
      const winsCount = {};

      semiFinalResults.forEach((result) => {
        // Inicializamos el conteo si no existe
        if (!winsCount[result.teamAId]) {
          winsCount[result.teamAId] = 0;
        }
        if (!winsCount[result.teamBId]) {
          winsCount[result.teamBId] = 0;
        }

        // Contar victorias
        if (result.resultA > result.resultB) {
          winsCount[result.teamAId] += 1; // Equipo A gana
        } else {
          winsCount[result.teamBId] += 1; // Equipo B gana
        }
      });

      // Obtener los IDs de los equipos
      const teams = Object.keys(winsCount).map(Number); // Convertir las claves a números

      // Ordenar equipos por victorias
      const sortedTeams = teams.sort((a, b) => winsCount[b] - winsCount[a]);

      const winner1 = sortedTeams[0]; // Ganador (más victorias)
      const winner2 = sortedTeams[1]; // Otro finalista
      const loser1 = sortedTeams[2]; // Perdedor (tercer puesto)
      const loser2 = sortedTeams[3]; // Otro perdedor

      // Crear partidos para la final y tercer puesto
      const finalMatchDay = new MatchDay(idTournament, 'Finales');

      // Partido por el tercer y cuarto puesto
      await this.matchDayService.createMatchDayStage(
        finalMatchDay,
        { teamAId: loser1, teamBId: loser2 },
        'Tercer y Cuarto Puesto',
      );

      // Partido Final
      await this.matchDayService.createMatchDayStage(
        finalMatchDay,
        { teamAId: winner1, teamBId: winner2 },
        'Partido Final',
      );
    }

    const tournamentUpdated = await this.repository.update(idTournament, {
      status: tournament.status,
    });

    return tournamentUpdated;
  }

  async deleteTournament(tournamentId: number): Promise<Tournament> {
    return await this.repository.delete(tournamentId);
  }

  async findTournamentByDescription(description: string): Promise<Tournament> {
    const tournament = await this.repository.findTournamentByDescription(
      description,
    );
    this.validator.validateExistingTournament(tournament);
    return tournament;
  }

  async validateTournamentsIds(ids: number[]): Promise<Tournament[]> {
    const tournaments = await this.repository.validateTournamentsIds(ids);
    return tournaments;
  }

  validateTournamentsIdsAgainstTournamentList(
    tournaments: Tournament[],
    ids: number[],
  ): boolean {
    this.validator.validateExistingTournamentsIds(tournaments, ids);
    return true;
  }

  async findTournamentById(tournamentId: number): Promise<Tournament> {
    const tournament = await this.repository.findById(tournamentId);
    this.validator.validateExistingTournament(tournament);
    return tournament;
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
    const tournament = await this.repository.getPointsByTournamentId();

    return tournament;
  }

  async fetchAllTournaments(): Promise<Tournament[]> {
    const tournaments = await this.repository.findAll();

    return tournaments;
  }

  async getSemiResults(): Promise<
    Array<{
      teamAId: number;
      teamBId: number;
      resultA: number;
      resultB: number;
    }>
  > {
    const tournaments = await this.repository.getSemiFinalResults(1);
    return tournaments;
  }

  async fetchNextMatchDay(): Promise<MatchDay[]> {
    const tournaments = await this.repository.findNextMatchDayWithMatches();
    return tournaments;
  }

  async fetchFixtureActiveTournament(): Promise<MatchDay[]> {
    const tournaments = await this.repository.findFixture();
    return tournaments;
  }

  async getAllPagination(
    page: number,
    limit: number,
    query: string,
    categoryId?: string,
  ): Promise<[Tournament[], PaginationMetaDto]> {
    const [tournaments, totalItems] =
      await this.repository.findAndCountWithQuery(
        (page - 1) * limit,
        limit,
        query,
        categoryId,
      );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = tournaments.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [tournaments, paginationMeta];
  }
}
