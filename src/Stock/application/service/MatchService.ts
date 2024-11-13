import { Injectable } from '@nestjs/common';

import Match from '../../domain/models/Match';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import MatchRepository from '../repository/MatchRepository';
import MatchValidations from '../validations/MatchValidations';
import { MatchDto } from 'Stock/infrastructure/dto/Match/MatchDto';
import MatchStatsService from './MatchStatsService';
import MatchStats from 'Stock/domain/models/MatchStats';
import { UpdateMatchDto } from 'Stock/infrastructure/dto/Match/UpdateMatchDto';

@Injectable()
export default class MatchService {
  constructor(
    private readonly repository: MatchRepository,
    private readonly validator: MatchValidations,
    private readonly matchStatService: MatchStatsService,
  ) {}

  async createMatch(match: Match): Promise<Match> {
    const matchCreated = await this.repository.insert({
      tournamentId: match.tournamentId,
      teamAId: match.teamAId,
      teamBId: match.teamBId,
      matchDayId: match.matchDayId,
      id: match.id,
    });
    return matchCreated;
  }
  async updateMatch(id: number, match: Match): Promise<Match> {
    console.log(match); // Verifica el objeto completo en la consola

    // Validación adicional para matchStats
    if (!match.matchStats) {
      console.error('matchStats está undefined');
      throw new Error('matchStats no está definido');
    }

    if (!Array.isArray(match.matchStats)) {
      console.error('matchStats no es un array:', match.matchStats);
      throw new Error('matchStats debe ser un array');
    }

    const matchUpdated = await this.repository.update(id, {
      map: match.map,
      resultTeamA: match.resultTeamA,
      resultTeamB: match.resultTeamB,
    });

    // Crear matchStats
    for (const stat of match.matchStats) {
      await this.matchStatService.createMatchStats(stat);
    }

    return matchUpdated;
  }

  async updateTeamsMatch(id: number, match: Match): Promise<Match> {
    const matchUpdated = await this.repository.updateTeams(id, {
      teamAId: match.teamAId,
      teamBId: match.teamBId,
    });

    return matchUpdated;
  }

  async deleteMatch(matchId: number): Promise<Match> {
    return await this.repository.delete(matchId);
  }

  async validateMatchsIds(ids: number[]): Promise<Match[]> {
    const matchs = await this.repository.validateMatchsIds(ids);
    return matchs;
  }

  validateMatchsIdsAgainstMatchList(matchs: Match[], ids: number[]): boolean {
    this.validator.validateExistingMatchsIds(matchs, ids);
    return true;
  }

  async findMatchById(matchId: number): Promise<Match> {
    const match = await this.repository.findById(matchId);
    this.validator.validateExistingMatch(match);
    return match;
  }

  async fetchAllMatchs(): Promise<Match[]> {
    return this.repository.findAll();
  }

  async fetchAllMatchsById(
    matchDayId: number,
    teamId: number,
  ): Promise<Match[]> {
    return this.repository.findByMatchDayId(matchDayId, teamId);
  }

  async getAllPagination(
    page: number,
    limit: number,
    query: string,
    categoryId?: string,
  ): Promise<[Match[], PaginationMetaDto]> {
    const [matchs, totalItems] = await this.repository.findAndCountWithQuery(
      (page - 1) * limit,
      limit,
      query,
      categoryId,
    );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = matchs.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [matchs, paginationMeta];
  }
}
