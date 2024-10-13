import { AutoMap } from '@automapper/classes';
import Team from './Team';
import ScoreTable from './ScoreTable';
import Match from './Match';
import MatchDay from './MatchDay';

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
    teams?: Team[],
    id?: number,
    endDate?: Date,
    matches?: Match[],
    scoreTables?: ScoreTable[],
    MatchDay?: MatchDay[],
    isActive?: Boolean,
  ) {
    this.id = id; // Asignar 0 si no se proporciona id
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.teams = teams || [];
    this.matches = matches || [];
    this.scoreTables = scoreTables || [];
    this.createdAt = new Date();
    this.MatchDay = MatchDay || [];
    this.isActive = isActive;
  }
}
