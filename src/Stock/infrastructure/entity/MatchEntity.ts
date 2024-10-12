import { AutoMap } from '@automapper/classes';
import { Match as IMatchEntity } from '@prisma/client';
import TeamEntity from './TeamEntity';
import TournamentEntity from './TournamentEntity';
import MatchStatsEntity from './MatchStatsEntity';
import MatchDay from 'Stock/domain/models/MatchDay';

class MatchEntity implements IMatchEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number;

  @AutoMap(() => TournamentEntity)
  tournament: TournamentEntity;

  @AutoMap()
  teamAId: number;

  @AutoMap(() => TeamEntity)
  teamA: TeamEntity;

  @AutoMap()
  teamBId: number;

  @AutoMap(() => TeamEntity)
  teamB: TeamEntity;

  @AutoMap()
  matchDayId: number;

  @AutoMap(() => MatchDay) // Asegúrate de que MatchDay esté bien definido
  matchDay: MatchDay;

  @AutoMap()
  map: string;

  @AutoMap()
  resultTeamA: number; // Cambia a obligatorio

  @AutoMap()
  resultTeamB: number; // Cambia a obligatorio

  @AutoMap(() => [MatchStatsEntity])
  matchStats: MatchStatsEntity[];
}

export default MatchEntity;
