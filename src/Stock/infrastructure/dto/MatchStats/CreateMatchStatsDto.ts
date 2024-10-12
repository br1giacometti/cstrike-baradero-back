import { AutoMap } from '@automapper/classes';
import Player from 'Stock/domain/models/Player';
import Team from 'Stock/domain/models/Team';

export class CreateMatchStatsDto {
  @AutoMap()
  id: number;

  @AutoMap()
  matchId: number; // Asegúrate de incluir matchId

  @AutoMap()
  playerId: number; // Asegúrate de incluir playerId

  @AutoMap()
  teamId: number; // Asegúrate de incluir teamId

  @AutoMap()
  kills?: number; // Asesinatos, opcional

  @AutoMap()
  deaths?: number; // Muertes, opcional

  @AutoMap(() => Team) // Relación con Team
  team: Team;

  @AutoMap(() => Player) // Relación con Player
  player: Player;
}
