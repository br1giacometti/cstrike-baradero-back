import { z } from 'zod';

const CreateMatchStatsSchema = z.object({
  description: z
    .string()
    .max(50, { message: 'must be a description' })
    .optional(),
  sellPrice: z.number(),
  minimumQUantity: z.number(),
});
export default CreateMatchStatsSchema;