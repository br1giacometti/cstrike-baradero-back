export default class MatchStatsDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.MATCHSTATS_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'MatchStatsDescriptionAlreadyInUseException';
  }
}
