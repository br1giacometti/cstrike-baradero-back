import { Injectable } from '@nestjs/common';
import ProductNotFoundException from '../exception/ProductNotFoundException';
import Product from 'Stock/domain/models/Product';
import ProductNotFoundForStockMovementException from '../exception/ProductNotFoundForStockMovementException';

@Injectable()
export default class ProductValidations {
  validateExistingProduct(product: Product): boolean {
    if (product === null) {
      throw new ProductNotFoundException();
    }
    return true;
  }

  validateExistingProductsIds(product: Product[], ids: number[]): boolean {
    if (product.length != ids.length) {
      throw new ProductNotFoundForStockMovementException();
    }
    return true;
  }
}
