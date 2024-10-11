import { AutoMap } from '@automapper/classes';
import { Category as ICategoryEntity } from '@prisma/client';

class CategoryEntity implements ICategoryEntity {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;
}

export default CategoryEntity;
