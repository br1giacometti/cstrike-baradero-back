import { AutoMap } from '@automapper/classes';
import Player from './Player';
import Match from './Match';
import Team from './Team';

export default class MatchStats {
  @AutoMap()
  id: number;

  @AutoMap()
  matchId: number;

  @AutoMap()
  playerId: number;

  @AutoMap()
  teamId: number;

  @AutoMap()
  kills: number;

  @AutoMap()
  deaths: number;

  @AutoMap(() => Match)
  match?: Match;

  @AutoMap(() => Player) // Relación con Player
  player?: Player;

  @AutoMap(() => Team) // Relación con Player
  team?: Team;

  constructor(
    matchId: number,
    playerId: number,
    teamId: number,
    kills: number = 0,
    deaths: number = 0,
    id?: number,
  ) {
    this.id = id;
    this.matchId = matchId;
    this.playerId = playerId;
    this.teamId = teamId;
    this.kills = kills;
    this.deaths = deaths;
  }
}
