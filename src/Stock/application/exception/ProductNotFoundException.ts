export default class ProductNotFoundException extends Error {
  constructor(message = 'StockErrors.PRODUCT_NOT_FOUND') {
    super(message);
    this.name = 'ProductNotFoundException';
  }
}
