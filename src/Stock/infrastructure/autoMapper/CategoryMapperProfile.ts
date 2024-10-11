import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import Category from 'Stock/domain/models/Category';
import { CategoryDto } from '../dto/Category/CategoryDto';
import { CreateCategoryDto } from '../dto/Category/CreateCategoryDto';
import CategoryEntity from '../entity/CategoryEntity';
import { UpdateCategoryDto } from '../dto/Category/UpdateCategoryDto';

@Injectable()
export class CategoryMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, CategoryEntity, Category);
      createMap(mapper, Category, CategoryDto);
      createMap(mapper, CategoryDto, Category);
      createMap(mapper, CreateCategoryDto, Category);
      createMap(mapper, UpdateCategoryDto, Category);
    };
  }
}
