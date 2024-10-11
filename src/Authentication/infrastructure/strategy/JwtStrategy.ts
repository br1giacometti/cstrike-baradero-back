import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import User from 'Authentication/domain/models/User';
import AuthenticationService from 'Authentication/application/service/AuthenticationService';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: AuthenticationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'viajaauto-secret',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findUserByEmail(payload.email);

    return user;
  }
}
export default JwtStrategy;
