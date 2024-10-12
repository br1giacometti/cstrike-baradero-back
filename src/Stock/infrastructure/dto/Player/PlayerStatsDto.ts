import { AutoMap } from '@automapper/classes';

export class PlayerStatsDto {
  @AutoMap()
  playerId: number;

  @AutoMap()
  kills: number;

  @AutoMap()
  deaths: number;
}
