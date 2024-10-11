export default class TournamentNotFoundException extends Error {
  constructor(message = 'StockErrors.TOURNAMENT_NOT_FOUND') {
    super(message);
    this.name = 'TournamentNotFoundException';
  }
}
