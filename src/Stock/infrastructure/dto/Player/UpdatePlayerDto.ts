import { AutoMap } from '@automapper/classes';
import Team from 'Stock/domain/models/Team';
import UpdatePlayerSchema from 'Stock/infrastructure/schema/UpdatePlayerSchema';
import { z } from 'zod';

export class UpdatePlayerDto {
  @AutoMap()
  id: number;
  @AutoMap()
  name: string;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  teamId: number;
  @AutoMap()
  team?: Team;

  constructor(data: z.infer<typeof UpdatePlayerSchema>) {
    Object.assign(this, data);
  }
}
