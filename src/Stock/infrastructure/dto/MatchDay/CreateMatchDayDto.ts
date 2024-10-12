import { AutoMap } from '@automapper/classes';
import Match from 'Stock/domain/models/Match';

export class CreateMatchDayDto {
  @AutoMap()
  tournamentId: number;

  @AutoMap()
  name: string;

  @AutoMap(() => [Match]) // Relación uno a muchos con los partidos
  matches?: Match[];
}
