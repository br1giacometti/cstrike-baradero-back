import { AutoMap } from '@automapper/classes';
import MatchDay from 'Stock/domain/models/MatchDay';
import CreateMatchSchema from 'Stock/infrastructure/schema/CreateMatchSchema';
import { z } from 'zod';

export class CreateMatchDto {
  @AutoMap()
  tournamentId: number;

  @AutoMap()
  teamAId: number;

  @AutoMap()
  teamBId: number;

  @AutoMap()
  matchDayId: number;

  @AutoMap(() => MatchDay)
  matchDay?: MatchDay;

  constructor(data: z.infer<typeof CreateMatchSchema>) {
    Object.assign(this, data);
  }
}
