import { AutoMap } from '@automapper/classes';
import Match from './Match'; // Importamos el modelo de Match

export default class MatchDay {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number; // ID del torneo al que pertenece la jornada

  @AutoMap()
  name: string; // Nombre de la jornada (ej. "Fecha 1", "Fecha 2", etc.)

  @AutoMap(() => [Match]) // Relación uno a muchos con los partidos
  matches?: Match[];

  constructor(
    tournamentId: number,
    name: string,
    matches?: Match[],
    id?: number,
  ) {
    this.id = id;
    this.tournamentId = tournamentId;
    this.name = name;
    this.matches = matches; // Asignamos los partidos de la jornada
  }
}
