import { z } from 'zod';

const UpdatePorductSchema = z.object({
  description: z
    .string()
    .max(50, { message: 'must be a description' })
    .optional(),
  sellPrice: z.number().optional(),
  minimumQUantity: z.number().optional(),
});
export default UpdatePorductSchema;
