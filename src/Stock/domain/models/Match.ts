import { AutoMap } from '@automapper/classes';
import Team from './Team';
import Tournament from './Tournament';
import MatchStats from './MatchStats'; // Importamos el modelo de MatchStats
import MatchDay from './MatchDay';

export default class Match {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number;

  @AutoMap()
  teamAId: number;

  @AutoMap()
  teamBId: number;

  @AutoMap()
  matchDayId: number;

  @AutoMap()
  matchDay?: MatchDay;

  @AutoMap()
  map?: string;

  @AutoMap()
  resultTeamA?: number;

  @AutoMap()
  resultTeamB?: number;

  @AutoMap(() => Tournament) // Relación con Tournament
  tournament?: Tournament;

  @AutoMap(() => Team) // Relación con Team A
  teamA?: Team;

  @AutoMap(() => Team) // Relación con Team B
  teamB?: Team;

  @AutoMap(() => [MatchStats]) // Relación con MatchStats
  matchStats?: MatchStats[]; // Array de estadísticas de jugadores

  constructor(
    tournamentId: number,
    teamAId: number,
    teamBId: number,
    matchDayId: number,
    map?: string,
    resultTeamA?: number,
    resultTeamB?: number,
    matchStats?: MatchStats[], // Incluimos matchStats en el constructor
    id?: number,
  ) {
    this.id = id;
    this.tournamentId = tournamentId;
    this.teamAId = teamAId;
    this.teamBId = teamBId;
    this.matchDayId = matchDayId;
    this.map = map;
    this.resultTeamA = resultTeamA;
    this.resultTeamB = resultTeamB;
    this.matchStats = matchStats; // Asignamos matchStats
  }
}
