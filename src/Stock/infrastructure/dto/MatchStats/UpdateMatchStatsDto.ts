import { AutoMap } from '@automapper/classes';
import Team from 'Stock/domain/models/Team';
import UpdateMatchStatsSchema from 'Stock/infrastructure/schema/UpdateMatchStatsSchema';
import { z } from 'zod';

export class UpdateMatchStatsDto {
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

  constructor(data: z.infer<typeof UpdateMatchStatsSchema>) {
    Object.assign(this, data);
  }
}
