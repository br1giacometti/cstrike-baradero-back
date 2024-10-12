export default class MatchStatsNotFoundException extends Error {
  constructor(message = 'StockErrors.MATCHSTATS_NOT_FOUND') {
    super(message);
    this.name = 'MatchStatsNotFoundException';
  }
}
