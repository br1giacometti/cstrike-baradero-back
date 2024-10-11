export default class ProductDescriptionAlreadyInUseException extends Error {
  constructor(message = 'StockErrors.PRODUCT_DESCRIPTION_ALREADY_IN_USE') {
    super(message);
    this.name = 'ProductDescriptionAlreadyInUseException';
  }
}
