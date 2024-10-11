export default class TeamDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.TEAM_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'TeamDescriptionAlreadyInUseException';
  }
}
