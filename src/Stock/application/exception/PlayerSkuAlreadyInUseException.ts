export default class PlayerSkuAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.SKU_ALREADY_IN_USE') {
    super(message);
    this.name = 'PlayerSkuAlreadyInUseException';
  }
}
