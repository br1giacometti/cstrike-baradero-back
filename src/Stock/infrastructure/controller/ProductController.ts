import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import Product from '../../domain/models/Product';

import ProductService from '../../application/service/ProductService';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';
import { ProductDto } from '../dto/Product/ProductDto';
import { CreateProductDto } from '../dto/Product/CreateProductDto';
import PaginationMetaDto from 'Base/dto/PaginationMetaDto';

@Controller('product')
export default class ProductController {
  constructor(
    private productService: ProductService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Product, ProductDto, { isArray: true }))
  async getAllProducts(): Promise<ProductDto[]> {
    return this.productService.fetchAllProducts().then((products) => products);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('/pagination')
  async getAllPagination(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('query') query: string,
    @Query('categoryId') categoryId: string,
  ): Promise<{ data: Product[]; meta: PaginationMetaDto }> {
    const [products, paginationMeta] =
      await this.productService.getAllPagination(
        +page,
        +limit,
        query,
        categoryId,
      );

    return { data: products, meta: paginationMeta };
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Product, ProductDto))
  async login(
    @Body() productDto: CreateProductDto,
    @I18n() i18n: I18nContext,
  ): Promise<ProductDto> {
    return this.productService
      .createProduct(
        await this.classMapper.mapAsync(productDto, CreateProductDto, Product),
      )
      .then((product) => product)
      .catch((error) => {
        switch (error.name) {
          case 'ProductDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'ProductSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Product, ProductDto))
  async getProductById(
    @Param('id') productId: string,
    @I18n() i18n: I18nContext,
  ): Promise<ProductDto> {
    return this.productService
      .findProductById(parseInt(productId))
      .then((product) => product)
      .catch((error) => {
        switch (error.name) {
          case 'ProductNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'ProductDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'ProductSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Product, ProductDto))
  async updateProduct(
    @Body() productDto: ProductDto,
    @Param('id') productId: string,
    @I18n() i18n: I18nContext,
  ): Promise<ProductDto> {
    return this.productService
      .updateProduct(
        parseInt(productId),
        await this.classMapper.mapAsync(productDto, CreateProductDto, Product),
      )
      .then((product) => product)
      .catch((error) => {
        switch (error.name) {
          case 'ProductDescriptionAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'ProductSkuAlreadyInUseException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          case 'ProductNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteProduct(@Param('id') productId: string): Promise<boolean> {
    return this.productService
      .deleteProduct(parseInt(productId))
      .then((productDeleted) => !!productDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
