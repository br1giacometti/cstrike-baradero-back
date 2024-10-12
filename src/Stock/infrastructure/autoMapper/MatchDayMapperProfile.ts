import MatchDay from 'Stock/domain/models/MatchDay';

import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import MatchDayEntity from '../entity/MatchDayEntity';
import { Converter, Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { MatchDayDto } from '../dto/MatchDay/MatchDayDto';

import { UpdateMatchDayDto } from '../dto/MatchDay/UpdateDayMatchDto';
import { CreateMatchDayDto } from '../dto/MatchDay/CreateMatchDayDto';

@Injectable()
export class MatchDayMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, MatchDayEntity, MatchDay);
      createMap(mapper, MatchDay, MatchDayDto);
      createMap(mapper, MatchDayDto, MatchDay);
      createMap(mapper, CreateMatchDayDto, MatchDay);
      // Agrega el mapeo para UpdateMatchDayDto
      createMap(mapper, UpdateMatchDayDto, MatchDay); // Mapeo de UpdateMatchDayDto a MatchDay
    };
  }
}
