export default class PlayerDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.PLAYER_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'PlayerDescriptionAlreadyInUseException';
  }
}
