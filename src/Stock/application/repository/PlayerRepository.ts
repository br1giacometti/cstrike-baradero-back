import BaseRepository from 'Base/repository/BaseRepository';
import Player from 'Stock/domain/models/Player';

export default abstract class PlayerRepository extends BaseRepository<Player> {
  abstract findPlayerByDescription: (
    description: string,
  ) => Promise<Player | null>;
  abstract validatePlayersIds(ids: number[]): Promise<Player[] | null>;
  abstract findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    teamId?: string,
  ): Promise<[Player[], number]>;

  abstract disconnectTeamPlayer: (playerId: number) => Promise<Player | null>;
  abstract connectTeamPlayer: (
    playerId: number,
    teamId: number,
  ) => Promise<Player | null>;

  abstract findAllNoTeam: () => Promise<Player[]>;
}
