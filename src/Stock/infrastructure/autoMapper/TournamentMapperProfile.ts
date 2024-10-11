import Tournament from 'Stock/domain/models/Tournament';
import { TournamentDto } from '../dto/Tournament/TournamentDto';
import { CreateTournamentDto } from '../dto/Tournament/CreateTournamentDto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import TournamentEntity from '../entity/TournamentEntity';
import { Converter, Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class TournamentMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, TournamentEntity, Tournament);
      createMap(mapper, Tournament, TournamentDto);
      createMap(mapper, TournamentDto, Tournament);
      createMap(mapper, CreateTournamentDto, Tournament);
    };
  }
}
