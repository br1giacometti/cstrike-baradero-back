import { Module } from '@nestjs/common';

import PrismaModule from 'Base/config/prisma/PrismaModule';
import AuthenticationModule from 'Authentication/infrastructure/module/AuthenticationModule';
import StockModule from 'Stock/infrastructure/module/SockModule';

import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuthenticationModule,
    StockModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: path.join(__dirname, '../i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class AppModule {}
