export default class InvalidStocmMovementTypeException extends Error {
  constructor(message = 'StockErrors.INVALID_STOCK_MOVEMENT_TYPE') {
    super(message);
    this.name = 'InvalidStocmMovementTypeException';
  }
}
