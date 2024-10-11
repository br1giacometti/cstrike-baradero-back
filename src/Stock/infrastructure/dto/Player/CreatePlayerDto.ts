import { AutoMap } from '@automapper/classes';
import CreatePlayerSchema from '../../schema/CreatePlayerSchema';
import { z } from 'zod';
import Team from 'Stock/domain/models/Team';

export class CreatePlayerDto {
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

  constructor(data: z.infer<typeof CreatePlayerSchema>) {
    Object.assign(this, data);
  }
}
