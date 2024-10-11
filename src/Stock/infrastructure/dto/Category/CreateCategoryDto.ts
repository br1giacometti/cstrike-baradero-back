import { AutoMap } from '@automapper/classes';
import CreateCategorySchema from '../../schema/CreateCategorySchema';
import { z } from 'zod';

export class CreateCategoryDto {
  @AutoMap()
  description: string;

  constructor(data: z.infer<typeof CreateCategorySchema>) {
    Object.assign(this, data);
  }
}
