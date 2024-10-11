export default class CategoryDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.CATEGORY_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'CategoryDescriptionAlreadyInUseException';
  }
}
