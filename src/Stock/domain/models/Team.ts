import { AutoMap } from '@automapper/classes';
import Player from './Player';

export default class Team {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap(() => [Player]) // Array de Player
  players: Player[];

  constructor(name: string, id?: number, players?: Player[]) {
    this.id = id;
    this.name = name;
    this.players = players;
  }
}
