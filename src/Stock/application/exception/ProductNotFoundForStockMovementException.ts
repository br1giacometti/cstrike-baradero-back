export default class ProductNotFoundForStockMovementException extends Error {
  constructor(message = 'StockErrors.PRODUCT_NOT_FOUND_FOR_STOCK_MOVEMENT') {
    super(message);
    this.name = 'ProductNotFoundForStockMovementException';
  }
}
