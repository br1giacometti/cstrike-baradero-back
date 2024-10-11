import { AutoMap } from '@automapper/classes';
import { Tournament as ITournamentEntity } from '@prisma/client';
import TeamEntity from './TeamEntity';
import MatchEntity from './MatchEntity';
import ScoreTableEntity from './ScoreTableEntity';

class TournamentEntity implements ITournamentEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  startDate: Date;

  @AutoMap()
  endDate: Date | null; // Puede ser nulo

  @AutoMap()
  createdAt: Date; // Agregar propiedad 'createdAt'

  @AutoMap(() => [TeamEntity]) // Array de TeamEntity
  teams: TeamEntity[];

  @AutoMap(() => [MatchEntity]) // Array de MatchEntity
  matches: MatchEntity[];

  @AutoMap(() => [ScoreTableEntity]) // Array de ScoreTableEntity
  scoreTables: ScoreTableEntity[];
}

export default TournamentEntity;
