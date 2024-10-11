import { Injectable } from '@nestjs/common';
import Category from 'Stock/domain/models/Category';
import CategoryNotFoundException from '../exception/CategoryNotFoundException';

@Injectable()
export default class CategoryValidations {
  validateExistingCategory(category: Category): boolean {
    if (category === null) {
      throw new CategoryNotFoundException();
    }
    return true;
  }
}
