import { AutoMap } from '@automapper/classes';
import CreatePorductSchema from '../../schema/CreatePorductSchema';
import { z } from 'zod';
import Category from 'Stock/domain/models/Category';

export class CreateProductDto {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;
  @AutoMap()
  sellPrice: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  categoryId: number;
  @AutoMap(() => Category)
  category?: Category;
  @AutoMap()
  barCode?: string;

  constructor(data: z.infer<typeof CreatePorductSchema>) {
    Object.assign(this, data);
  }
}
