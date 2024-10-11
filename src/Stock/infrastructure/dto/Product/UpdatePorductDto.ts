import { AutoMap } from '@automapper/classes';
import Category from 'Stock/domain/models/Category';
import UpdatePorductSchema from 'Stock/infrastructure/schema/UpdatePorductSchema';
import { z } from 'zod';

export class UpdateProductDto {
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
  @AutoMap()
  category?: Category;
  @AutoMap()
  barCode: String;

  constructor(data: z.infer<typeof UpdatePorductSchema>) {
    Object.assign(this, data);
  }
}
