export default class PlayerNotFoundToSellException extends Error {
  constructor(message = 'StockErrors.PLAYER_NOT_FOUND_TO_SELL') {
    super(message);
    this.name = 'PlayerNotFoundToSellException';
  }
}
