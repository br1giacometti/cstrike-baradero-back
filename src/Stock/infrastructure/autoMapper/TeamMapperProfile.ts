import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import Team from 'Stock/domain/models/Team';
import TeamEntity from '../entity/TeamEntity';
import { TeamDto } from '../dto/Team/TeamDto';
import { CreateTeamDto } from '../dto/Team/CreateTeamDto';
import { UpdateTeamDto } from '../dto/Team/UpdateTeamDto';
import Player from 'Stock/domain/models/Player'; // Asegúrate de que Player esté importado

@Injectable()
export class TeamMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      // Mapeo de TeamEntity a Team (mapea automáticamente 'players' si las propiedades coinciden)
      createMap(mapper, TeamEntity, Team);

      // Mapeo de Team a TeamDto (mapea automáticamente 'players' si las propiedades coinciden)
      createMap(mapper, Team, TeamDto);

      // Otros mapeos para Create y Update Team DTOs
      createMap(mapper, TeamDto, Team);
      createMap(mapper, CreateTeamDto, Team);
      createMap(mapper, UpdateTeamDto, Team);
    };
  }
}
