import { AutoMap } from '@automapper/classes';
import Category from 'Stock/domain/models/Category';

export class ProductDto {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;
  @AutoMap()
  sellPrice: number;
  @AutoMap()
  categoryId: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap(() => Category)
  category?: Category;
  @AutoMap()
  barCode?: string;
}
