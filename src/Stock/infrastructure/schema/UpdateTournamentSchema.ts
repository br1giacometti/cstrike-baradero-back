import { z } from 'zod';

const UpdateTournamentSchema = z.object({
  name: z.string().max(50, { message: 'must be a description' }).optional(),
});
export default UpdateTournamentSchema;
