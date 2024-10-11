import { AutoMap } from '@automapper/classes';
import { Player as IPlayerEntity } from '@prisma/client';
import Team from 'Stock/domain/models/Team';

class PlayerEntity implements IPlayerEntity {
  @AutoMap()
  id: number;
  @AutoMap()
  name: string;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  teamId: number;
  @AutoMap(() => Team)
  team: Team;
}

export default PlayerEntity;
