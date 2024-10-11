export default class TournamentNotFoundForStockMovementException extends Error {
  constructor(message = 'StockErrors.TOURNAMENT_NOT_FOUND_FOR_STOCK_MOVEMENT') {
    super(message);
    this.name = 'TournamentNotFoundForStockMovementException';
  }
}
