export default class MatchDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.MATCH_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'MatchDescriptionAlreadyInUseException';
  }
}
