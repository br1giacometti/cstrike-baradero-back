import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import CategoryRepository from 'Stock/application/repository/CategoryRepository';
import Category from 'Stock/domain/models/Category';
import CategoryEntity from '../entity/CategoryEntity';
import CategoryDescriptionAlreadyInUseException from 'Stock/application/exception/CategoryDescriptionAlreadyInUseException';
import CategoryNotFoundException from 'Stock/application/exception/CategoryNotFoundException';

@Injectable()
export default class CategoryDataProvider implements CategoryRepository {
  client: Prisma.CategoryDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.category;
  }

  findCategoryByDescription: (description: string) => Promise<Category>;

  async insert(category: Category): Promise<Category> {
    try {
      const categoryEntity = await this.client.create({
        data: {
          description: category.description,
        },
      });

      return this.classMapper.mapAsync(
        categoryEntity,
        CategoryEntity,
        Category,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new CategoryDescriptionAlreadyInUseException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async findById(id: number): Promise<Category | null> {
    const categoryEntity = await this.client.findUnique({
      where: { id },
    });
    return this.classMapper.mapAsync(categoryEntity, CategoryEntity, Category);
  }

  async findAll(): Promise<Category[]> {
    const categoryes = await this.client.findMany({});

    return this.classMapper.mapArrayAsync(categoryes, CategoryEntity, Category);
  }

  async delete(id: number): Promise<Category> {
    const categoryEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(categoryEntity, CategoryEntity, Category);
  }

  async update(
    id: number,
    partialCategory: Partial<Category>,
  ): Promise<Category> {
    try {
      const categoryEntity = await this.client.update({
        data: {
          description: partialCategory.description,
        },
        where: {
          id,
        },
      });
      return this.classMapper.mapAsync(
        categoryEntity,
        CategoryEntity,
        Category,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new CategoryNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }
}
