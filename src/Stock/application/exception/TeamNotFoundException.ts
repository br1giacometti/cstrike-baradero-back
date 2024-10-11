export default class TeamNotFoundException extends Error {
  constructor(message = 'StockErrors.TEAM_NOT_FOUND') {
    super(message);
    this.name = 'TeamNotFoundException';
  }
}
