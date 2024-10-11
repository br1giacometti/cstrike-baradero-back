import { Injectable } from '@nestjs/common';
import InvalidEmailException from '../exception/InvalidEmailException';
import InvalidPasswordException from '../exception/InvalidPasswordException';
import UserDoesntExistsException from '../exception/UserDoesntExistsException';
import User from 'Authentication/domain/models/User';

@Injectable()
export default class UserValidations {
  static validatePassword(password: string) {
    // Is at least 6 characters long, contains at least one leter and contains at least one number
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
  }

  static readonly validateEmail = (email: string): boolean => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  };

  validatePassAndEmailFormat(email: string, password: string): boolean {
    if (!UserValidations.validateEmail(email)) {
      throw new InvalidEmailException();
    }
    if (!UserValidations.validatePassword(password)) {
      throw new InvalidPasswordException();
    }
    return true;
  }

  validateExistingUser(user: User): boolean {
    if (user === null) {
      throw new UserDoesntExistsException();
    }
    return true;
  }
}
