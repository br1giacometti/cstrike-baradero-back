import { AutoMap } from '@automapper/classes';
import Player from 'Stock/domain/models/Player';

export class TeamDto {
  @AutoMap()
  id: number;
  @AutoMap()
  name: string;
  @AutoMap(() => Player)
  players: Player[];
}
