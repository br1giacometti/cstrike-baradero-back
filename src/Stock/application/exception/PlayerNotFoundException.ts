export default class PlayerNotFoundException extends Error {
  constructor(message = 'StockErrors.PLAYER_NOT_FOUND') {
    super(message);
    this.name = 'PlayerNotFoundException';
  }
}
