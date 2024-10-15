import BaseRepository from 'Base/repository/BaseRepository';
import MatchDay from 'Stock/domain/models/MatchDay';
import Tournament from 'Stock/domain/models/Tournament';
import { TournamentStage } from 'Stock/domain/models/TournamentStage';

export default abstract class TournamentRepository extends BaseRepository<Tournament> {
  abstract findTournamentByDescription: (
    description: string,
  ) => Promise<Tournament | null>;
  abstract validateTournamentsIds(ids: number[]): Promise<Tournament[] | null>;

  abstract findNextMatchDayWithMatches: () => Promise<MatchDay[]>;
  abstract findFixture: () => Promise<Tournament[]>;

  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[Tournament[], number]>;
  abstract getPointsByTournamentId(): Promise<
    Array<{
      idEquipo: number;
      nombreEquipo: string;
      victoriasTotales: number;
      derrotasTotales: number;
      puntuacionTotal: number;
    }>
  >;

  abstract findStatusId: () => Promise<TournamentStage>;

  abstract getSemiFinalResults(idTournament: number): Promise<
    Array<{
      teamAId: number;
      teamBId: number;
      resultA: number;
      resultB: number;
    }>
  >;
}
