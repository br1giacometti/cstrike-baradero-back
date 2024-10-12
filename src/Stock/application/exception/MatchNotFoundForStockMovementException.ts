export default class MatchNotFoundForStockMovementException extends Error {
  constructor(message = 'StockErrors.MATCH_NOT_FOUND_FOR_STOCK_MOVEMENT') {
    super(message);
    this.name = 'MatchNotFoundForStockMovementException';
  }
}
