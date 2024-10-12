import { AutoMap } from '@automapper/classes';
import { TournamentDto } from '../Tournament/TournamentDto';
import Match from 'Stock/domain/models/Match';

export class MatchDayDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap(() => [Match]) // Relación uno a muchos con los partidos
  matches?: Match[];
}
