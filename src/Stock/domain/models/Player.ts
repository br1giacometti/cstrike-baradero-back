import { AutoMap } from '@automapper/classes';
import Team from './Team';

export default class Player {
  @AutoMap()
  id: number;
  @AutoMap()
  name: string;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  teamId: number;
  @AutoMap(() => Team)
  team?: Team;
  @AutoMap()
  kills?: number;

  @AutoMap()
  deaths?: number;

  constructor(
    name: string,
    team?: Team,
    id?: number,
    createdAt?: Date,
    kills?: number,
    deaths?: number,
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.team = team;
    this.kills = kills;
    this.deaths = deaths;
  }
}
