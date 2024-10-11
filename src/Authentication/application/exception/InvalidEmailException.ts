export default class InvalidEmailException extends Error {
  constructor(message = 'AuthErrors.INVALID_EMAIL') {
    super(message);
    this.name = 'InvalidEmailException';
  }
}
