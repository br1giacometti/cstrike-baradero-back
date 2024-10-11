import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import User from 'Authentication/domain/models/User';
import UserRepository from 'Authentication/application/repository/UserRepository';

import UserEntity from '../entity/UserEntity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import EmailAlreadyInUseException from 'Authentication/application/exception/EmailAlreadyInUseException';

@Injectable()
export default class UserDataProvider implements UserRepository {
  client: Prisma.UserDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userEntity = await this.client.findUnique({ where: { email } });
    return this.classMapper.mapAsync(userEntity, UserEntity, User);
  }

  async insert(user: User): Promise<User> {
    try {
      const userEntity = await this.client.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          createdAt: new Date(),
          lastLogin: null,
          googleId: user.googleId,
          cellphoneNumber:
            user.cellphoneNumber != null ? user.cellphoneNumber : null,
        },
      });

      return this.classMapper.mapAsync(userEntity, UserEntity, User);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EmailAlreadyInUseException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.client.findUnique({ where: { id } });

    return this.classMapper.mapAsync(userEntity, UserEntity, User);
  }

  async findAll(): Promise<User[]> {
    const users = await this.client.findMany();

    return this.classMapper.mapArrayAsync(users, UserEntity, User);
  }

  async delete(id: string): Promise<User> {
    const userEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(userEntity, UserEntity, User);
  }

  async update(id: string, partialUser: Partial<User>): Promise<User> {
    const userEntity = await this.client.update({
      data: {
        firstName: partialUser.firstName,
        lastName: partialUser.lastName,
        email: partialUser.email,
        password: partialUser.password,
        cellphoneNumber:
          partialUser.cellphoneNumber != null
            ? partialUser.cellphoneNumber
            : null,
      },
      where: {
        id,
      },
    });
    return this.classMapper.mapAsync(userEntity, UserEntity, User);
  }

  async updateLastLogin(id: string): Promise<boolean> {
    const userEntity = await this.client.update({
      data: {
        lastLogin: new Date(),
      },
      where: {
        id,
      },
    });
    return userEntity == null ? false : true;
  }
}
