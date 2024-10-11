import { Injectable } from '@nestjs/common';

import User from '../../domain/models/User';
import * as bcrypt from 'bcrypt';

import UserRepository from '../repository/UserRepository';
import UserNotFoundException from 'Authentication/application/exception/UserNotFoundException';
import UserValidations from '../validations/UserValidations';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'google-auth-library';
import LoginResponse from 'Authentication/domain/models/LoginResponse';
import PayloadValidations from '../validations/PayloadValidations';

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly repository: UserRepository,
    private readonly validator: UserValidations,
    private readonly jwtService: JwtService,
    private readonly payloadValidator: PayloadValidations,
  ) {}

  async createUser(user: User): Promise<User> {
    let passwordHashed = '';
    if (user.googleId == null)
      this.validator.validatePassAndEmailFormat(user.email, user.password);
    if (user.password != null)
      passwordHashed = await bcrypt.hash(user.password, 10);

    const userCreated = await this.repository.insert({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: passwordHashed == '' ? null : passwordHashed,
      createdAt: new Date(),
      googleId: user.googleId != null ? user.googleId : null,
      lastLogin: null,
      cellphoneNumber: null,
    });
    return userCreated;
  }

  async deleteUser(userId: string): Promise<User> {
    return await this.repository.delete(userId);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findUserByEmail(email);
    this.validator.validateExistingUser(user);
    return user;
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.repository.findById(userId);

    if (user === null) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async fetchAllUsers(): Promise<User[]> {
    const users = await this.repository.findAll();
    return users;
  }

  async googleLogin(payload: TokenPayload): Promise<LoginResponse> {
    this.payloadValidator.validatePayload(payload);
    let user: User;
    user = await this.repository.findUserByEmail(payload.email);
    if (user == null) {
      user = await this.createUser({
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        createdAt: new Date(),
        lastLogin: undefined,
        password: undefined,
        googleId: payload.aud,
        cellphoneNumber: undefined,
      });
    }
    await this.repository.updateLastLogin(user.id);

    const accessToken = this.jwtService.sign({
      email: payload.email,
      id: user.id,
    });

    return { user, accessToken };
  }

  async login(userParam: User): Promise<LoginResponse> {
    this.validator.validatePassAndEmailFormat(
      userParam.email,
      userParam.password,
    );
    const user = await this.findUserByEmail(userParam.email);
    await this.repository.updateLastLogin(user.id);
    const accessToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return { user, accessToken };
  }
}
