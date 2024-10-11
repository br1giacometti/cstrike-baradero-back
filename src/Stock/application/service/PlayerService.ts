import { Injectable } from '@nestjs/common';

import Player from '../../domain/models/Player';

import PlayerValidations from '../validations/PlayerValidations';
import PlayerRepository from '../repository/PlayerRepository';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';

@Injectable()
export default class PlayerService {
  constructor(
    private readonly repository: PlayerRepository,
    private readonly validator: PlayerValidations,
  ) {}

  async createPlayer(player: Player): Promise<Player> {
    const playerCreated = await this.repository.insert({
      name: player.name,
      teamId: player.teamId,
      createdAt: player.createdAt,
      id: player.id,
    });
    return playerCreated;
  }

  async updatePlayer(id: number, player: Player): Promise<Player> {
    const playerCreated = await this.repository.update(id, {
      name: player.name,
      teamId: player.teamId,
    });
    return playerCreated;
  }

  async deletePlayer(playerId: number): Promise<Player> {
    return await this.repository.delete(playerId);
  }

  async findPlayerByDescription(description: string): Promise<Player> {
    const player = await this.repository.findPlayerByDescription(description);
    this.validator.validateExistingPlayer(player);
    return player;
  }

  async validatePlayersIds(ids: number[]): Promise<Player[]> {
    const players = await this.repository.validatePlayersIds(ids);
    return players;
  }

  validatePlayersIdsAgainstPlayerList(
    players: Player[],
    ids: number[],
  ): boolean {
    this.validator.validateExistingPlayersIds(players, ids);
    return true;
  }

  async findPlayerById(playerId: number): Promise<Player> {
    const player = await this.repository.findById(playerId);
    this.validator.validateExistingPlayer(player);
    return player;
  }

  async fetchAllPlayers(): Promise<Player[]> {
    const players = await this.repository.findAll();
    return players;
  }

  async getAllPagination(
    page: number,
    limit: number,
    query: string,
    categoryId?: string,
  ): Promise<[Player[], PaginationMetaDto]> {
    const [players, totalItems] = await this.repository.findAndCountWithQuery(
      (page - 1) * limit,
      limit,
      query,
      categoryId,
    );

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = players.length;

    const paginationMeta: PaginationMetaDto = {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
    };

    return [players, paginationMeta];
  }
}
