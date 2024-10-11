import { AutoMap } from '@automapper/classes';

export default class Category {
  @AutoMap()
  id: number;
  @AutoMap()
  description: string;

  constructor(description: string, id?: number) {
    this.id = id;
    this.description = description;
  }
}
