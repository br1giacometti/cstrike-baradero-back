import { AutoMap } from '@automapper/classes';
import Player from 'Stock/domain/models/Player';

export class UpdateTeamDto {
  @AutoMap()
  name: string;
  @AutoMap()
  players: Player[];
}
