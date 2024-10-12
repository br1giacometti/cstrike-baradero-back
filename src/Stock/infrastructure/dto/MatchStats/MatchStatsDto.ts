import { AutoMap } from '@automapper/classes';
import Player from 'Stock/domain/models/Player';
import Team from 'Stock/domain/models/Team';

export class MatchStatsDto {
  @AutoMap()
  id: number;
  @AutoMap()
  teamId: number;

  @AutoMap(() => Player)
  player?: Player;
  @AutoMap()
  playerId: number;
  @AutoMap()
  kills?: number;
  @AutoMap(() => Team)
  team?: Team;
  @AutoMap()
  deaths?: number;
}
