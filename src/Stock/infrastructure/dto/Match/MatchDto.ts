import { AutoMap } from '@automapper/classes';
import { TournamentDto } from '../Tournament/TournamentDto';

import { MatchStatsDto } from '../MatchStats/MatchStatsDto';
import { TeamDto } from '../Team/TeamDto';
import MatchDay from 'Stock/domain/models/MatchDay';

export class MatchDto {
  @AutoMap()
  id: number;

  @AutoMap()
  matchDayId: number;

  @AutoMap()
  map?: string;

  @AutoMap()
  resultTeamA?: number;

  @AutoMap()
  resultTeamB?: number;

  @AutoMap(() => TeamDto)
  teamA?: TeamDto;

  @AutoMap()
  winner?: string;

  @AutoMap(() => TeamDto)
  teamB?: TeamDto;

  @AutoMap(() => TournamentDto)
  tournament?: TournamentDto;

  @AutoMap(() => [MatchStatsDto])
  matchStats?: MatchStatsDto[];

  @AutoMap(() => MatchDay)
  matchDay?: MatchDay;
}
