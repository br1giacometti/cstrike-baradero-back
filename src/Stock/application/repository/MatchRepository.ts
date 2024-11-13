import BaseRepository from 'Base/repository/BaseRepository';
import Match from 'Stock/domain/models/Match';
import { UpdateMatchDto } from 'Stock/infrastructure/dto/Match/UpdateMatchDto';

export default abstract class MatchRepository extends BaseRepository<Match> {
  abstract validateMatchsIds(ids: number[]): Promise<Match[] | null>;
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[Match[], number]>;

  // Agrega este método
  abstract findByMatchDayId(
    matchDayId: number,
    teamId: number,
  ): Promise<Match[]>;

  abstract updateTeams(
    id: number,
    partialMatch: Partial<UpdateMatchDto>,
  ): Promise<Match>;
}
