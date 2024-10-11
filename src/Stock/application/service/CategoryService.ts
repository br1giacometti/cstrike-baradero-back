import { Injectable } from '@nestjs/common';

import CategoryRepository from '../repository/CategoryRepository';
import CategoryValidations from '../validations/CategoryValidations';
import Category from 'Stock/domain/models/Category';

@Injectable()
export default class CategoryService {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly validator: CategoryValidations,
  ) {}

  async createCategory(category: Category): Promise<Category> {
    const categoryCreated = await this.repository.insert({
      description: category.description,
      id: category.id,
    });
    return categoryCreated;
  }

  async updateCategory(id: number, category: Category): Promise<Category> {
    const categoryCreated = await this.repository.update(id, {
      description: category.description,
    });
    return categoryCreated;
  }

  async deleteCategory(categoryId: number): Promise<Category> {
    return await this.repository.delete(categoryId);
  }

  async findCategoryById(categoryId: number): Promise<Category> {
    const category = await this.repository.findById(categoryId);
    this.validator.validateExistingCategory(category);
    return category;
  }

  async fetchAllCategorys(): Promise<Category[]> {
    const category = await this.repository.findAll();
    return category;
  }
}
