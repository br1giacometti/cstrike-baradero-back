import { Injectable } from '@nestjs/common';

import Match from '../../domain/models/Match';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import MatchRepository from '../repository/MatchRepository';
import MatchValidations from '../validations/MatchValidations';
import { MatchDto } from 'Stock/infrastructure/dto/Match/MatchDto';

@Injectable()
export default class MatchService {
  constructor(
    private readonly repository: MatchRepository,
    private readonly validator: MatchValidations,
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
  async updateMatch(id: number, matchstats: Match): Promise<Match> {
    const matchstatsCreated = await this.repository.update(id, {
      map: matchstats.map,
      resultTeamA: matchstats.resultTeamA,
      resultTeamB: matchstats.resultTeamB,
    });
    return matchstatsCreated;
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
    const matchs = await this.repository.findAll();
    return matchs;
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
