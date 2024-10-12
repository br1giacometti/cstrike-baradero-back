import { AutoMap } from '@automapper/classes';
import Team from 'Stock/domain/models/Team';
import UpdateTournamentSchema from 'Stock/infrastructure/schema/UpdateTournamentSchema';
import { z } from 'zod';

export class UpdateTournamentDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  createdAt: Date; // Esta propiedad puede no ser necesaria en una actualización, según tu lógica de negocio

  @AutoMap()
  teamId: number;

  @AutoMap(() => Team)
  team?: Team; // Opcional

  constructor(data: z.infer<typeof UpdateTournamentSchema>) {
    Object.assign(this, data);
  }
}