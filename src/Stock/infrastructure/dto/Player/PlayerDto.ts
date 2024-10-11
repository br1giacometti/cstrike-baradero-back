import { AutoMap } from '@automapper/classes';
import Team from 'Stock/domain/models/Team';

export class PlayerDto {
  @AutoMap()
  id: number;
  @AutoMap()
  name: string;
  @AutoMap()
  teamId: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap(() => Team)
  team?: Team;
}
