import BaseRepository from 'Base/repository/BaseRepository';
import Match from 'Stock/domain/models/Match';

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
}
