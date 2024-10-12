import MatchStats from 'Stock/domain/models/MatchStats';

import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { Converter, Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { MatchStatsDto } from '../dto/MatchStats/MatchStatsDto';
import MatchStatsEntity from '../entity/MatchStatsEntity';
import { CreateMatchStatsDto } from '../dto/MatchStats/CreateMatchStatsDto';

@Injectable()
export class MatchStatsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, MatchStatsEntity, MatchStats);
      createMap(mapper, MatchStats, MatchStatsDto);
      createMap(mapper, MatchStatsDto, MatchStats);
      createMap(mapper, CreateMatchStatsDto, MatchStats);
    };
  }
}
