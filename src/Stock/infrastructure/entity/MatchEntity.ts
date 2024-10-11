import { AutoMap } from '@automapper/classes';
import { Match as IMatchEntity } from '@prisma/client';
import TeamEntity from './TeamEntity';

class MatchEntity implements IMatchEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number;

  @AutoMap()
  teamAId: number;

  @AutoMap()
  teamBId: number;

  @AutoMap()
  date: Date;

  @AutoMap()
  result: string | null; // Puede ser nulo

  @AutoMap()
  stats: any; // Usa el tipo correcto según tu necesidad

  @AutoMap(() => TeamEntity) // Referencia a TeamEntity
  teamA: TeamEntity;

  @AutoMap(() => TeamEntity) // Referencia a TeamEntity
  teamB: TeamEntity;
}

export default MatchEntity;
