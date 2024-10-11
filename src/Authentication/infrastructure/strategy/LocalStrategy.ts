import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import * as bcrypt from 'bcrypt';

import User from 'Authentication/domain/models/User';

import { I18nService } from 'nestjs-i18n';
import AuthenticationService from 'Authentication/application/service/AuthenticationService';
import InvalidPasswordException from 'Authentication/application/exception/InvalidPasswordException';
import UserValidations from 'Authentication/application/validations/UserValidations';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: AuthenticationService,
    private readonly i18n: I18nService,
    private readonly validator: UserValidations,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      this.validator.validatePassAndEmailFormat(email, password);
      const user = await this.userService.findUserByEmail(email);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        const pwExc = new InvalidPasswordException();
        throw new InvalidPasswordException(this.i18n.t(pwExc.message));
      }
      return user;
    } catch (error) {
      switch (error.name) {
        case 'InvalidPasswordException': {
          throw new HttpException(this.i18n.t(error.message), 404);
        }
        case 'UserDoesntExistsException': {
          throw new HttpException(this.i18n.t(error.message), 404);
        }
        case 'InvalidEmailException': {
          throw new HttpException(this.i18n.t(error.message), 404);
        }
        default: {
          throw new HttpException('Unauthorized', 404);
        }
      }
    }
  }
}
