export default class CategoryNotFoundException extends Error {
  constructor(message = 'StockErrors.CATEGORY_NOT_FOUND') {
    super(message);
    this.name = 'CategoryNotFoundException';
  }
}
