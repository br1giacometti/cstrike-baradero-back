import { AutoMap } from '@automapper/classes';
import Player from 'Stock/domain/models/Player';
import CreateTeamSchema from 'Stock/infrastructure/schema/CreateTeamSchema';

import { z } from 'zod';

export class CreateTeamDto {
  @AutoMap()
  name: string;
  @AutoMap(() => Player)
  players: Player[];

  constructor(data: z.infer<typeof CreateTeamSchema>) {
    Object.assign(this, data);
  }
}
