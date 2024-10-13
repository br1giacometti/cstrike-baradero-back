import { AutoMap } from '@automapper/classes';
import { z } from 'zod';
import UpdateMatchSchema from 'Stock/infrastructure/schema/UpdateMatchSchema'; // Asegúrate de que el esquema sea correcto
import MatchStats from 'Stock/domain/models/MatchStats';

export class UpdateMatchDto {
  @AutoMap()
  map: string;

  @AutoMap()
  resultTeamA: number;

  @AutoMap()
  resultTeamB: number;

  @AutoMap(() => MatchStats)
  matchStats: MatchStats[];

  constructor(data: z.infer<typeof UpdateMatchSchema>) {
    Object.assign(this, data); // Asigna los datos del esquema a la instancia
  }
}
