import { AutoMap } from '@automapper/classes';
import Team from './Team';
import ScoreTable from './ScoreTable';
import Match from './Match';
import MatchDay from './MatchDay';
import { TournamentStage } from './TournamentStage'; // Importar el enum

export default class Tournament {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  startDate: Date;

  @AutoMap(() => [Team]) // Array de Team
  teams: Team[];

  @AutoMap(() => [Match]) // Array de Match
  matches: Match[];

  @AutoMap(() => [ScoreTable]) // Array de ScoreTable
  scoreTables: ScoreTable[];

  // Nuevo campo status con el enum TournamentStage
  @AutoMap()
  status: TournamentStage;

  @AutoMap()
  endDate?: Date;

  @AutoMap()
  createdAt: Date;

  @AutoMap(() => [MatchDay])
  MatchDay?: MatchDay[];

  @AutoMap()
  isActive?: Boolean;

  constructor(
    name: string,
    startDate: Date,
    status: TournamentStage = TournamentStage.GROUP_STAGE, // Estado inicial predeterminado
    teams?: Team[],
    id?: number,
    endDate?: Date,
    matches?: Match[],
    scoreTables?: ScoreTable[],
    MatchDay?: MatchDay[],
    isActive?: Boolean,
  ) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.status = status; // Inicializamos el estado con el enum
    this.endDate = endDate;
    this.teams = teams || [];
    this.matches = matches || [];
    this.scoreTables = scoreTables || [];
    this.createdAt = new Date();
    this.MatchDay = MatchDay || [];
    this.isActive = isActive;
  }
}
