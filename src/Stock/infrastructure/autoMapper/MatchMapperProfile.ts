import Match from 'Stock/domain/models/Match';

import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import MatchEntity from '../entity/MatchEntity';
import { Converter, Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { MatchDto } from '../dto/Match/MatchDto';
import { CreateMatchDto } from '../dto/Match/CreateMatchDto';
import { UpdateMatchDto } from '../dto/Match/UpdateMatchDto';

@Injectable()
export class MatchMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, MatchEntity, Match);
      createMap(mapper, Match, MatchDto);
      createMap(mapper, MatchDto, Match);
      createMap(mapper, CreateMatchDto, Match);
      // Agrega el mapeo para UpdateMatchDto
      createMap(mapper, UpdateMatchDto, Match); // Mapeo de UpdateMatchDto a Match
    };
  }
}
