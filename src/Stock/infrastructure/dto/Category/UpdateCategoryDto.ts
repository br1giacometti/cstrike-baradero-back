import { AutoMap } from '@automapper/classes';

export class UpdateCategoryDto {
  @AutoMap()
  description: string;
}
