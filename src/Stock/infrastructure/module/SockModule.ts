import { Module } from '@nestjs/common';

import PlayerService from 'Stock/application/service/PlayerService';

import PlayerRepository from 'Stock/application/repository/PlayerRepository';
import PlayerValidations from 'Stock/application/validations/PlayerValidations';
import TeamController from '../controller/TeamController';
import TeamService from 'Stock/application/service/TeamService';
import TeamRepository from 'Stock/application/repository/TeamRepository';

import TeamValidations from 'Stock/application/validations/TeamValidations';
import { TeamMapperProfile } from '../autoMapper/TeamMapperProfile';
import { HttpModule } from '@nestjs/axios';
import TeamDataProvider from '../dataProvider/TeamDataProvider';
import PlayerController from '../controller/PlayerController';
import PlayerDataProvider from '../dataProvider/PlayerDataProvider';
import { PlayerMapperProfile } from '../autoMapper/PlayerMapperProfile';

@Module({
  controllers: [PlayerController, TeamController],
  imports: [HttpModule],
  providers: [
    PlayerService,
    {
      provide: PlayerRepository,
      useClass: PlayerDataProvider,
    },
    PlayerMapperProfile,
    PlayerValidations,
    TeamService,
    TeamValidations,
    {
      provide: TeamRepository,
      useClass: TeamDataProvider,
    },
    TeamMapperProfile,
  ],
})
export default class StockModule {}
