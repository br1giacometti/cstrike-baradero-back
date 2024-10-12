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
import MatchController from '../controller/MatchController';
import MatchService from 'Stock/application/service/MatchService';
import MatchRepository from 'Stock/application/repository/MatchRepository';
import MatchDataProvider from '../dataProvider/MatchDataProvider';
import { MatchMapperProfile } from '../autoMapper/MatchMapperProfile';
import MatchValidations from 'Stock/application/validations/MatchValidations';
import MatchStatsController from '../controller/MatchStatsController';
import MatchStatsService from 'Stock/application/service/MatchStatsService';
import MatchStatsRepository from 'Stock/application/repository/MatchStatsRepository';
import { MatchStatsMapperProfile } from '../autoMapper/MatchStatsMapperProfile';
import MatchStatsValidations from 'Stock/application/validations/MatchStatsValidations';
import MatchStatsDataProvider from '../dataProvider/MatchStatsDataProvider';
import MatchDay from 'Stock/domain/models/MatchDay';
import MatchDayController from '../controller/MatchDayController';
import MatchDayService from 'Stock/application/service/MatchDayService';
import MatchDayRepository from 'Stock/application/repository/MatchRepository copy';
import MatchDayDataProvider from '../dataProvider/MatchDayDataProvider';
import { MatchDayMapperProfile } from '../autoMapper/MatchDayMapperProfile';

@Module({
  controllers: [
    PlayerController,
    TeamController,
    TournamentController,
    MatchController,
    MatchStatsController,
    MatchDayController,
  ],
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
    MatchService,
    {
      provide: MatchRepository,
      useClass: MatchDataProvider,
    },
    MatchStatsService,
    {
      provide: MatchStatsRepository,
      useClass: MatchStatsDataProvider,
    },
    MatchDayService,
    {
      provide: MatchDayRepository,
      useClass: MatchDayDataProvider,
    },
    PlayerMapperProfile,
    TournamentMapperProfile,
    TournamentValidations,
    MatchMapperProfile,
    MatchValidations,
    MatchStatsMapperProfile,
    MatchStatsValidations,
    MatchDayMapperProfile,
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
