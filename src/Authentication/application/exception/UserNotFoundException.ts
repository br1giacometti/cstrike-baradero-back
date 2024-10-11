export default class UserNotFoundException extends Error {
  constructor(message = 'AuthErrors.USER_NOT_FOUND') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}
