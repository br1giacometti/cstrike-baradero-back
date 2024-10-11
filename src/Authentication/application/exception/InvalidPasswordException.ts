export default class InvalidPasswordException extends Error {
  constructor(message = 'AuthErrors.INVALID_PASSWORD') {
    super(message);
    this.name = 'InvalidPasswordException';
  }
}
