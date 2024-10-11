import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Mapper } from '@automapper/core';
import JwtAuthGuard from 'Authentication/infrastructure/guards/JwtAuthGuard';
import CategoryService from 'Stock/application/service/CategoryService';
import Category from 'Stock/domain/models/Category';
import { CreateCategoryDto } from '../dto/Category/CreateCategoryDto';
import { CategoryDto } from '../dto/Category/CategoryDto';
import { UpdateCategoryDto } from '../dto/Category/UpdateCategoryDto';

@Controller('category')
export default class CategoryController {
  constructor(
    private categoryService: CategoryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Category, CategoryDto, { isArray: true }))
  async getAllCategoryss(): Promise<CategoryDto[]> {
    return this.categoryService
      .fetchAllCategorys()
      .then((category) => category);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Category, CategoryDto))
  async getCategoryById(
    @Param('id') categoryId: string,
    @I18n() i18n: I18nContext,
  ): Promise<CategoryDto> {
    return this.categoryService
      .findCategoryById(parseInt(categoryId))
      .then((category) => category)
      .catch((error) => {
        switch (error.name) {
          case 'CategoryNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Category, CategoryDto))
  async login(@Body() categoryDto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryService
      .createCategory(
        await this.mapper.mapAsync(categoryDto, CreateCategoryDto, Category),
      )
      .then((category) => category)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MapInterceptor(Category, CategoryDto))
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') categoryId: string,
    @I18n() i18n: I18nContext,
  ): Promise<CategoryDto> {
    return this.categoryService
      .updateCategory(
        parseInt(categoryId),
        await this.mapper.mapAsync(
          updateCategoryDto,
          UpdateCategoryDto,
          Category,
        ),
      )
      .then((category) => category)
      .catch((error) => {
        switch (error.name) {
          case 'CategoryNotFoundException': {
            throw new HttpException(i18n.t(error.message), 404);
          }
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id') categoryId: number): Promise<boolean> {
    return this.categoryService
      .deleteCategory(categoryId)
      .then((categoryDeleted) => !!categoryDeleted)
      .catch((error) => {
        switch (error.name) {
          default: {
            throw new HttpException(error.message, 500);
          }
        }
      });
  }
}
