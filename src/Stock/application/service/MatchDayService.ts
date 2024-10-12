import { Injectable } from '@nestjs/common';

import MatchDay from '../../domain/models/MatchDay';

import PaginationMetaDto from 'Base/dto/PaginationMetaDto';
import MatchDayRepository from '../repository/MatchRepository copy';
import MatchRepository from '../repository/MatchRepository';
import MatchService from './MatchService';

@Injectable()
export default class MatchDayService {
  constructor(
    private readonly repository: MatchDayRepository,
    private readonly serviceMatch: MatchService,
  ) {}

  async createMatchDay(matchday: MatchDay): Promise<MatchDay> {
    // Crear el MatchDay

    const matchdayCreated = await this.repository.insert({
      tournamentId: matchday.tournamentId,
      name: matchday.name,
      id: matchday.id,
    });

    // Crear los Matches asociados
    for (const match of matchday.matches) {
      await this.serviceMatch.createMatch({
        tournamentId: matchdayCreated.tournamentId,
        teamAId: match.teamAId,
        teamBId: match.teamBId,
        matchDayId: matchdayCreated.id, // Asocia el Match con el MatchDay recién creado
        id: match.id,
      });
    }

    return matchdayCreated; // Devuelve el MatchDay creado
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
