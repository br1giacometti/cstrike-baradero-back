import { AutoMap } from '@automapper/classes';
import { Team as ITeamEntity } from '@prisma/client';
import Player from 'Stock/domain/models/Player';

class TeamEntity implements ITeamEntity {
  @AutoMap()
  id: number;
  @AutoMap()
  name: string;
  @AutoMap(() => Player)
  players: Player[];
}

export default TeamEntity;
