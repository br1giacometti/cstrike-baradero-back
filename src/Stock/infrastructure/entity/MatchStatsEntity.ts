import { AutoMap } from '@automapper/classes';
import { MatchStats as IMatchStatsEntity } from '@prisma/client';
import Match from 'Stock/domain/models/Match';
import Team from 'Stock/domain/models/Team';
import PlayerEntity from './PlayerEntity';

class MatchStatsEntity implements IMatchStatsEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  matchId: number;

  @AutoMap()
  playerId: number;

  @AutoMap()
  teamId: number; // Asegúrate de incluir teamId

  @AutoMap()
  kills: number; // Asesinatos

  @AutoMap()
  deaths: number; // Muertes

  @AutoMap(() => Match) // Relación con Match
  match?: Match;

  @AutoMap(() => Team) // Relación con Team
  team: Team; // Asegúrate de incluir el equipo

  @AutoMap(() => PlayerEntity) // Relación con Team
  player: PlayerEntity; // Asegúrate de incluir el equipo
}

export default MatchStatsEntity;
