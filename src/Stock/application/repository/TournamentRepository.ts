import BaseRepository from 'Base/repository/BaseRepository';
import Tournament from 'Stock/domain/models/Tournament';

export default abstract class TournamentRepository extends BaseRepository<Tournament> {
  abstract findTournamentByDescription: (
    description: string,
  ) => Promise<Tournament | null>;
  abstract validateTournamentsIds(ids: number[]): Promise<Tournament[] | null>;
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[Tournament[], number]>;
  abstract getPointsByTournamentId(
    tournamentId: number,
  ): Promise<
    Array<{
      idEquipo: number;
      nombreEquipo: string;
      victoriasTotales: number;
      derrotasTotales: number;
      puntuacionTotal: number;
    }>
  >;
}
