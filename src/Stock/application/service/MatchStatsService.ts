import { Injectable } from '@nestjs/common';

import MatchStatsRepository from '../repository/MatchStatsRepository';
import MatchStatsValidations from '../validations/MatchStatsValidations';
import MatchStats from 'Stock/domain/models/MatchStats';
import { kill } from 'process';

@Injectable()
export default class MatchStatsService {
  constructor(
    private readonly repository: MatchStatsRepository,
    private readonly validator: MatchStatsValidations,
  ) {}

  async createMatchStats(matchstats: MatchStats): Promise<MatchStats> {
    const matchstatsCreated = await this.repository.insert({
      matchId: matchstats.matchId,
      playerId: matchstats.playerId,
      teamId: matchstats.teamId,
      kills: matchstats.kills,
      deaths: matchstats.deaths,
      id: matchstats.id,
    });
    return matchstatsCreated;
  }

  async updateMatchStats(
    id: number,
    matchstats: MatchStats,
  ): Promise<MatchStats> {
    const matchstatsCreated = await this.repository.update(id, {
      matchId: matchstats.matchId,
    });
    return matchstatsCreated;
  }

  async deleteMatchStats(matchstatsId: number): Promise<MatchStats> {
    return await this.repository.delete(matchstatsId);
  }

  async findMatchStatsById(matchstatsId: number): Promise<MatchStats> {
    const matchstats = await this.repository.findById(matchstatsId);
    this.validator.validateExistingMatchStats(matchstats);
    return matchstats;
  }

  async fetchTop10Players(): Promise<MatchStats[]> {
    const matchstats = await this.repository.findAll();
    return matchstats;
  }

  async fetchAllMatchStatss(): Promise<MatchStats[]> {
    const matchstats = await this.repository.findAll();
    return matchstats;
  }
}
