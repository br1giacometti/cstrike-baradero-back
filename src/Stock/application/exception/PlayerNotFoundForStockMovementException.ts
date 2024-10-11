export default class PlayerNotFoundForStockMovementException extends Error {
  constructor(message = 'StockErrors.PLAYER_NOT_FOUND_FOR_STOCK_MOVEMENT') {
    super(message);
    this.name = 'PlayerNotFoundForStockMovementException';
  }
}
