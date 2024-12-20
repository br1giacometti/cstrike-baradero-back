import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import PlayerRepository from 'Stock/application/repository/PlayerRepository';

import PlayerNotFoundException from 'Stock/application/exception/PlayerNotFoundException';
import Player from 'Stock/domain/models/Player';
import PlayerEntity from '../entity/PlayerEntity';

@Injectable()
export default class PlayerDataProvider implements PlayerRepository {
  client: Prisma.PlayerDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.player;
  }

  async findPlayerByDescription(name: string): Promise<Player | null> {
    const playerEntity = await this.client.findUnique({
      where: { name },
      include: { team: true },
    });
    return this.classMapper.mapAsync(playerEntity, PlayerEntity, Player);
  }

  async insert(player: Player): Promise<Player> {
    try {
      const playerEntity = await this.client.create({
        data: {
          name: player.name,
          teamId: player.teamId,
        },
        include: { team: true },
      });
      return this.classMapper.mapAsync(playerEntity, PlayerEntity, Player);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async findById(id: number): Promise<Player | null> {
    const playerEntity = await this.client.findUnique({
      where: { id },
      include: { team: true },
    });
    return this.classMapper.mapAsync(playerEntity, PlayerEntity, Player);
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    teamId?: string,
  ): Promise<[Player[], number]> {
    query = query == undefined ? '' : query;

    const where: any = {
      AND: [teamId ? { categoryId: { equals: parseInt(teamId) } } : {}],
    };

    const players = await this.client.findMany({
      skip: skip,
      take: take,
      include: { team: true },
      where,
    });
    const count = await this.client.count({ where });

    const mappedPlayers = await this.classMapper.mapArrayAsync(
      players,
      PlayerEntity,
      Player,
    );
    return [mappedPlayers, count];
  }

  async findAll(): Promise<Player[]> {
    const players = await this.client.findMany({
      include: { team: true },
      orderBy: {
        name: 'asc', // Ordenar por descripción en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(players, PlayerEntity, Player);
  }

  async findAllNoTeam(): Promise<Player[]> {
    const players = await this.client.findMany({
      where: {
        team: {
          is: null, // Filtrar jugadores que no tienen un equipo
        },
      },
      orderBy: {
        name: 'asc', // Ordenar por nombre en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(players, PlayerEntity, Player);
  }

  async delete(id: number): Promise<Player> {
    const playerEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(playerEntity, PlayerEntity, Player);
  }

  async disconnectTeamPlayer(id: number): Promise<Player> {
    // Busca al jugador por su ID
    const playerEntity = await this.client.findUnique({
      where: { id },
    });

    // Asegúrate de que el jugador existe
    if (!playerEntity) {
      throw new Error('Jugador no encontrado');
    }

    // Actualiza el jugador para desconectarlo del equipo
    const updatedPlayerEntity = await this.client.update({
      where: { id },
      data: {
        team: { disconnect: true }, // Desconectar el jugador del equipo
      },
    });

    // Mapea el jugador actualizado a la entidad deseada
    return this.classMapper.mapAsync(updatedPlayerEntity, PlayerEntity, Player);
  }

  async connectTeamPlayer(playerId: number, teamId: number): Promise<Player> {
    // Busca al jugador por su ID
    const playerEntity = await this.client.findUnique({
      where: { id: playerId },
    });

    // Asegúrate de que el jugador existe
    if (!playerEntity) {
      throw new Error('Jugador no encontrado');
    }

    // Actualiza el jugador para conectarlo al equipo
    const updatedPlayerEntity = await this.client.update({
      where: { id: playerId },
      data: {
        team: { connect: { id: teamId } }, // Conectar el jugador al equipo
      },
    });

    // Mapea el jugador actualizado a la entidad deseada
    return this.classMapper.mapAsync(updatedPlayerEntity, PlayerEntity, Player);
  }

  async update(id: number, partialPlayer: Partial<Player>): Promise<Player> {
    try {
      const playerEntity = await this.client.update({
        data: {
          name: partialPlayer.name,
          team: {
            connect: partialPlayer.teamId
              ? { id: partialPlayer.teamId }
              : undefined,
            // Si deseas desconectar el equipo anterior, puedes hacerlo así:
            // disconnect: true,
          },
        },
        include: { team: true },
        where: {
          id,
        },
      });
      return this.classMapper.mapAsync(playerEntity, PlayerEntity, Player);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new PlayerNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async validatePlayersIds(ids: number[]): Promise<Player[] | null> {
    const playerEntity = await this.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return this.classMapper.mapArrayAsync(playerEntity, PlayerEntity, Player);
  }
}
