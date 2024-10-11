import { AutoMap } from '@automapper/classes';
import Category from './Category';

export default class Product {
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

  constructor(
    description: string,
    sellPrice: number,
    category?: Category,
    barCode?: string,
    id?: number,
    createdAt?: Date,
  ) {
    this.id = id;
    this.description = description;
    this.sellPrice = sellPrice;
    this.createdAt = createdAt;
    this.barCode = barCode;
    this.category = category;
  }
}
