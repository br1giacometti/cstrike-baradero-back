import { AutoMap } from '@automapper/classes';
import { z } from 'zod';
import Team from 'Stock/domain/models/Team';
import CreateTournamentSchema from 'Stock/infrastructure/schema/CreateTournamentSchema';

export class CreateTournamentDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  createdAt: Date; // Se puede inicializar con la fecha actual

  @AutoMap(() => [Team]) // Aquí especificas que es un array de Team
  teams: { id: number }[]; // Solo necesitas el ID del equipo

  constructor(data: z.infer<typeof CreateTournamentSchema>) {
    // Asegúrate de que createdAt tenga un valor por defecto
    this.createdAt = new Date(); // Inicializa con la fecha actual si no se proporciona
    Object.assign(this, data);
  }
}
