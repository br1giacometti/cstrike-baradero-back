import { Injectable } from '@nestjs/common';

import MatchDay from '../../domain/models/MatchDay';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import MatchDayRepository from '../repository/MatchRepository copy';

@Injectable()
export default class MatchDayService {
  constructor(private readonly repository: MatchDayRepository) {}

  async createMatchDay(matchday: MatchDay): Promise<MatchDay> {
    const matchdayCreated = await this.repository.insert({
      tournamentId: matchday.tournamentId,
      name: matchday.name,
      id: matchday.id,
    });
    return matchdayCreated;
  }
  async updateMatchDay(id: number, matchdaystats: MatchDay): Promise<MatchDay> {
    const matchdaystatsCreated = await this.repository.update(id, {
      name: matchdaystats.name,
    });
    return matchdaystatsCreated;
  }

  async deleteMatchDay(matchdayId: number): Promise<MatchDay> {
    return await this.repository.delete(matchdayId);
  }

  async findMatchDayById(matchdayId: number): Promise<MatchDay> {
    const matchday = await this.repository.findById(matchdayId);

    return matchday;
  }

  async fetchAllMatchDays(): Promise<MatchDay[]> {
    const matchdays = await this.repository.findAll();
    return matchdays;
  }
}
