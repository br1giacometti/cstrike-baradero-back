import { AutoMap } from '@automapper/classes';
import Team from './Team';
import Tournament from './Tournament';

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
  date: Date;

  @AutoMap()
  result?: string; // Nullable para permitir resultados opcionales

  @AutoMap()
  stats?: Record<string, any>; // Campo Json para estadísticas

  @AutoMap(() => Tournament) // Relación con Tournament
  tournament: Tournament;

  @AutoMap(() => Team) // Relación con Team A
  teamA: Team;

  @AutoMap(() => Team) // Relación con Team B
  teamB: Team;

  constructor(
    tournamentId: number,
    teamAId: number,
    teamBId: number,
    date: Date,
    result?: string,
    stats?: Record<string, any>,
    id?: number,
  ) {
    this.id = id; // Asignar 0 si no se proporciona id
    this.tournamentId = tournamentId;
    this.teamAId = teamAId;
    this.teamBId = teamBId;
    this.date = date;
    this.result = result;
    this.stats = stats;
  }
}
