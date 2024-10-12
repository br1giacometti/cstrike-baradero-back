import { Injectable } from '@nestjs/common';

import Match from 'Stock/domain/models/Match';
import MatchNotFoundException from '../exception/MatchNotFoundException';
import MatchNotFoundForStockMovementException from '../exception/MatchNotFoundForStockMovementException';

@Injectable()
export default class MatchValidations {
  validateExistingMatch(match: Match): boolean {
    if (match === null) {
      throw new MatchNotFoundException();
    }
    return true;
  }

  validateExistingMatchsIds(match: Match[], ids: number[]): boolean {
    if (match.length != ids.length) {
      throw new MatchNotFoundForStockMovementException();
    }
    return true;
  }
}
