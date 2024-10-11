export default class PlayerNotFoundToAplicationException extends Error {
  constructor(message = 'StockErrors.PLAYER_NOT_FOUND') {
    super(message);
    this.name = 'PlayerNotFoundToAplicationException';
  }
}
