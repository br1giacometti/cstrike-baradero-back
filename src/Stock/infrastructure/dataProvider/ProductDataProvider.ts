import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import PrismaClient from 'Base/config/prisma/PrismaClient';

import ProductEntity from '../entity/ProductEntity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import ProductRepository from 'Stock/application/repository/ProductRepository';
import Product from 'Stock/domain/models/Product';
import ProductNotFoundException from 'Stock/application/exception/ProductNotFoundException';

@Injectable()
export default class ProductDataProvider implements ProductRepository {
  client: Prisma.ProductDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor(
    prisma: PrismaClient,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    this.client = prisma.product;
  }

  async findProductByDescription(description: string): Promise<Product | null> {
    const productEntity = await this.client.findUnique({
      where: { description },
      include: { category: true },
    });
    return this.classMapper.mapAsync(productEntity, ProductEntity, Product);
  }

  async insert(product: Product): Promise<Product> {
    try {
      const productEntity = await this.client.create({
        data: {
          sellPrice: product.sellPrice,
          description: product.description,
          barCode: product.barCode,
          categoryId: product.categoryId,
        },
        include: { category: true },
      });
      return this.classMapper.mapAsync(productEntity, ProductEntity, Product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async findById(id: number): Promise<Product | null> {
    const productEntity = await this.client.findUnique({
      where: { id },
      include: { category: true },
    });
    return this.classMapper.mapAsync(productEntity, ProductEntity, Product);
  }

  async findAndCountWithQuery(
    skip: number,
    take: number,
    query: string,
    categoryId?: string,
  ): Promise<[Product[], number]> {
    query = query == undefined ? '' : query;

    const where: any = {
      AND: [
        {
          OR: [
            { description: { contains: query, mode: 'insensitive' } },
            { barCode: { contains: query, mode: 'insensitive' } },
          ],
        },
        categoryId ? { categoryId: { equals: parseInt(categoryId) } } : {},
      ],
    };

    const products = await this.client.findMany({
      skip: skip,
      take: take,
      include: {
        category: true,
      },
      where,
    });
    const count = await this.client.count({ where });

    const mappedProducts = await this.classMapper.mapArrayAsync(
      products,
      ProductEntity,
      Product,
    );
    return [mappedProducts, count];
  }

  async findAll(): Promise<Product[]> {
    const products = await this.client.findMany({
      include: { category: true },
      orderBy: {
        description: 'asc', // Ordenar por descripción en orden ascendente
      },
    });

    return this.classMapper.mapArrayAsync(products, ProductEntity, Product);
  }

  async delete(id: number): Promise<Product> {
    const productEntity = await this.client.delete({ where: { id } });

    return this.classMapper.mapAsync(productEntity, ProductEntity, Product);
  }

  async update(id: number, partialProduct: Partial<Product>): Promise<Product> {
    try {
      const productEntity = await this.client.update({
        data: {
          sellPrice: partialProduct.sellPrice,
          description: partialProduct.description,
          barCode: partialProduct.barCode,
        },
        include: { category: true },
        where: {
          id,
        },
      });
      return this.classMapper.mapAsync(productEntity, ProductEntity, Product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ProductNotFoundException();
        }
        throw new Error(error.message);
      }
      throw new Error('Unkwown error');
    }
  }

  async validateProductsIds(ids: number[]): Promise<Product[] | null> {
    const productEntity = await this.client.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    return this.classMapper.mapArrayAsync(
      productEntity,
      ProductEntity,
      Product,
    );
  }
}
