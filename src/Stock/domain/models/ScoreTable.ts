import { AutoMap } from '@automapper/classes';
import Team from './Team';
import Tournament from './Tournament';

export default class ScoreTable {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number;

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

  @AutoMap(() => Tournament) // Relación con Tournament
  tournament: Tournament;

  @AutoMap(() => Team) // Relación con Team
  team: Team;

  constructor(
    tournamentId: number,
    teamId: number,
    points: number = 0,
    wins: number = 0,
    losses: number = 0,
    draws: number = 0,
    id?: number,
  ) {
    this.id = id || 0; // Asignar 0 si no se proporciona id
    this.tournamentId = tournamentId;
    this.teamId = teamId;
    this.points = points;
    this.wins = wins;
    this.losses = losses;
    this.draws = draws;
  }
}
