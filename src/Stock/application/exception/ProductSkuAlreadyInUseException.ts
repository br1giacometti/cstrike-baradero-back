export default class ProductSkuAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.SKU_ALREADY_IN_USE') {
    super(message);
    this.name = 'ProductSkuAlreadyInUseException';
  }
}
