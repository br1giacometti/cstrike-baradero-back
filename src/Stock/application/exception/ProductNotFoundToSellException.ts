export default class ProductNotFoundToSellException extends Error {
  constructor(message = 'StockErrors.PRODUCT_NOT_FOUND_TO_SELL') {
    super(message);
    this.name = 'ProductNotFoundToSellException';
  }
}
