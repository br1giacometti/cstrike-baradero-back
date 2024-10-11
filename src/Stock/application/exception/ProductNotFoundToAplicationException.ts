export default class ProductNotFoundToAplicationException extends Error {
  constructor(message = 'StockErrors.PRODUCT_NOT_FOUND') {
    super(message);
    this.name = 'ProductNotFoundToAplicationException';
  }
}
