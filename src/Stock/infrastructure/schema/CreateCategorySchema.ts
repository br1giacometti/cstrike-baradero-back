import { z } from 'zod';

const CreateCategorySchema = z.object({
  description: z.string().max(50, { message: 'must be a description' }),
});
export default CreateCategorySchema;
