import { AutoMap } from '@automapper/classes';
import { z } from 'zod';
import UpdateMatchSchema from 'Stock/infrastructure/schema/UpdateMatchSchema'; // Asegúrate de que el esquema sea correcto

export class UpdateMatchDto {
  @AutoMap()
  map: string;

  @AutoMap()
  resultTeamA: number;

  @AutoMap()
  resultTeamB: number;

  constructor(data: z.infer<typeof UpdateMatchSchema>) {
    Object.assign(this, data); // Asigna los datos del esquema a la instancia
  }
}
