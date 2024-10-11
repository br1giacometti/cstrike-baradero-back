import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { LoginResponseDto } from 'Authentication/application/dto/LoginResponseDto';
import LoginResponse from 'Authentication/domain/models/LoginResponse';

@Injectable()
export class LoginResponseProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, LoginResponse, LoginResponseDto);
      createMap(mapper, LoginResponseDto, LoginResponse);
    };
  }
}
