import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';

@Injectable()
export default class PayloadValidations {
  validatePayload(payload: TokenPayload): boolean {
    if (!payload || !payload.email) throw new UnauthorizedException();
    return true;
  }
}
