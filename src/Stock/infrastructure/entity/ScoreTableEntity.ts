import { AutoMap } from '@automapper/classes';
import { ScoreTable as IScoreTableEntity } from '@prisma/client';
import TeamEntity from './TeamEntity';

class ScoreTableEntity implements IScoreTableEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number; // Agregar propiedad 'tournamentId'

  @AutoMap()
  teamId: number;

  @AutoMap()
  points: number;

  @AutoMap()
  wins: number;

  @AutoMap()
  losses: number;

  @AutoMap()
  draws: number;

  @AutoMap(() => TeamEntity) // Referencia a TeamEntity
  team: TeamEntity;
}

export default ScoreTableEntity;
