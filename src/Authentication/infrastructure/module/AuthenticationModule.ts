import { Module } from '@nestjs/common';
import AuthenticationController from '../controller/AuthenticationController';
import AuthenticationService from '../../application/service/AuthenticationService';
import UserDataProvider from '../dataProvider/UserDataProvider';
import UserRepository from 'Authentication/application/repository/UserRepository';
import { UserMapperProfile } from '../autoMapper/UserMapperProfile';
import UserValidations from 'Authentication/application/validations/UserValidations';
import JwtStrategy from '../strategy/JwtStrategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import LocalStrategy from '../strategy/LocalStrategy';
import { LoginResponseProfile } from '../autoMapper/LoginResponseProfile';
import PayloadValidations from 'Authentication/application/validations/PayloadValidations';

const jwtFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: 'viajaauto-secret',
    signOptions: {
      expiresIn: '999d',
    },
  }),
  inject: [ConfigService],
};

@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: UserRepository,
      useClass: UserDataProvider,
    },
    UserMapperProfile,
    LoginResponseProfile,
    UserValidations,
    PayloadValidations,
    JwtStrategy,
    LocalStrategy,
  ],
  imports: [JwtModule.registerAsync(jwtFactory), PassportModule],
  exports: [AuthenticationService, JwtModule, JwtStrategy],
})
export default class UserModule {}
