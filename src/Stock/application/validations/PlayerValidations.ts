import { Injectable } from '@nestjs/common';
import PlayerNotFoundException from '../exception/PlayerNotFoundException';

import PlayerNotFoundForStockMovementException from '../exception/PlayerNotFoundForStockMovementException';
import Player from 'Stock/domain/models/Player';

@Injectable()
export default class PlayerValidations {
  validateExistingPlayer(player: Player): boolean {
    if (player === null) {
      throw new PlayerNotFoundException();
    }
    return true;
  }

  validateExistingPlayersIds(player: Player[], ids: number[]): boolean {
    if (player.length != ids.length) {
      throw new PlayerNotFoundForStockMovementException();
    }
    return true;
  }
}
