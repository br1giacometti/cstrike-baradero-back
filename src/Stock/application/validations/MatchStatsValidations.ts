import { Injectable } from '@nestjs/common';
import MatchStats from 'Stock/domain/models/MatchStats';
import MatchStatsNotFoundException from '../exception/MatchStatsNotFoundException';

@Injectable()
export default class MatchStatsValidations {
  validateExistingMatchStats(matchstats: MatchStats): boolean {
    if (matchstats === null) {
      throw new MatchStatsNotFoundException();
    }
    return true;
  }
}
