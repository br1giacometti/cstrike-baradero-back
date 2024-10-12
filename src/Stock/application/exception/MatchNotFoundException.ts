export default class MatchNotFoundException extends Error {
  constructor(message = 'StockErrors.MATCH_NOT_FOUND') {
    super(message);
    this.name = 'MatchNotFoundException';
  }
}
