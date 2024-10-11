import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'Authentication/application/dto/UserDto';
import UserEntity from '../entity/UserEntity';
import User from 'Authentication/domain/models/User';

@Injectable()
export class UserMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, UserEntity, User);
      createMap(
        mapper,
        User,
        UserDto,
        forMember((dest) => dest.password, ignore()),
      );
      createMap(mapper, UserDto, User);
    };
  }
}
