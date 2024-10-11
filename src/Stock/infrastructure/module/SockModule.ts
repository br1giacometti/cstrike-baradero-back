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
import TournamentController from '../controller/TournamentController';
import TournamentService from 'Stock/application/service/TournamentService';
import TournamentRepository from 'Stock/application/repository/TournamentRepository';
import TournamentDataProvider from '../dataProvider/TournamentDataProvider';
import { TournamentMapperProfile } from '../autoMapper/TournamentMapperProfile';
import TournamentValidations from 'Stock/application/validations/TournamentValidations';

@Module({
  controllers: [PlayerController, TeamController, TournamentController],
  imports: [HttpModule],
  providers: [
    PlayerService,
    {
      provide: PlayerRepository,
      useClass: PlayerDataProvider,
    },
    TournamentService,
    {
      provide: TournamentRepository,
      useClass: TournamentDataProvider,
    },
    PlayerMapperProfile,
    TournamentMapperProfile,
    TournamentValidations,
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
