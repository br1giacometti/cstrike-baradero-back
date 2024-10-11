export default class TournamentDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.TOURNAMENT_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'TournamentDescriptionAlreadyInUseException';
  }
}
