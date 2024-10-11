import Player from 'Stock/domain/models/Player';
import { PlayerDto } from '../dto/Player/PlayerDto';
import { CreatePlayerDto } from '../dto/Player/CreatePlayerDto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import PlayerEntity from '../entity/PlayerEntity';
import { Converter, Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class PlayerMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, PlayerEntity, Player);
      createMap(mapper, Player, PlayerDto);
      createMap(mapper, PlayerDto, Player);
      createMap(mapper, CreatePlayerDto, Player);
    };
  }
}
