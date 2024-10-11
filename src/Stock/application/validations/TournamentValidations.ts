import { Injectable } from '@nestjs/common';

import Tournament from 'Stock/domain/models/Tournament';
import TournamentNotFoundException from '../exception/TournamentNotFoundException';
import TournamentNotFoundForStockMovementException from '../exception/TournamentNotFoundForStockMovementException copy';

@Injectable()
export default class TournamentValidations {
  validateExistingTournament(tournament: Tournament): boolean {
    if (tournament === null) {
      throw new TournamentNotFoundException();
    }
    return true;
  }

  validateExistingTournamentsIds(
    tournament: Tournament[],
    ids: number[],
  ): boolean {
    if (tournament.length != ids.length) {
      throw new TournamentNotFoundForStockMovementException();
    }
    return true;
  }
}
