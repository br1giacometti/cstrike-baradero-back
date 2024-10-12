import { AutoMap } from '@automapper/classes';
import Match from 'Stock/domain/models/Match';
import Tournament from 'Stock/domain/models/Tournament';

export default class MatchDayEntity {
  @AutoMap()
  id: number;

  @AutoMap()
  tournamentId: number; // ID del torneo al que pertenece la jornada

  @AutoMap()
  name: string; // Nombre de la jornada (ej. "Fecha 1", "Fecha 2", etc.)

  @AutoMap(() => [Match]) // Relación uno a muchos con los partidos
  matches?: Match[];

  @AutoMap(() => Tournament) // Relación con Tournament
  tournament?: Tournament; // Información del torneo
}
