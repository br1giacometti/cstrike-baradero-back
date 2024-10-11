export default class InsufficientQuantityException extends Error {
  constructor(message = 'StockErrors.QUANTITY_INSUFICIENT') {
    super(message);
    this.name = 'InsufficientQuantityException';
  }
}
