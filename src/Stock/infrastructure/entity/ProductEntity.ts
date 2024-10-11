import { AutoMap } from '@automapper/classes';
import { Product as IProductEntity } from '@prisma/client';
import Category from 'Stock/domain/models/Category';

class ProductEntity implements IProductEntity {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;
  @AutoMap()
  sellPrice: number;
  @AutoMap()
  createdAt: Date;
  @AutoMap()
  barCode: string;
  @AutoMap()
  categoryId: number;
  @AutoMap(() => Category)
  category: Category;
}

export default ProductEntity;
