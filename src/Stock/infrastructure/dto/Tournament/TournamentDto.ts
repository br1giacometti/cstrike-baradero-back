import { AutoMap } from '@automapper/classes';
import Match from 'Stock/domain/models/Match';
import MatchDay from 'Stock/domain/models/MatchDay';
import ScoreTable from 'Stock/domain/models/ScoreTable';
import Team from 'Stock/domain/models/Team';

export class TournamentDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap(() => [Team])
  teams: Team[]; // Cambia teamId por teams

  @AutoMap(() => Match)
  matches: Match[]; // Asegúrate de incluir los matches si es necesario

  @AutoMap(() => ScoreTable)
  scoreTables: ScoreTable[]; // Asegúrate de incluir las scoreTables si es necesario

  @AutoMap(() => [MatchDay]) // Mapea MatchDay correctamente
  MatchDay?: MatchDay[];
}
