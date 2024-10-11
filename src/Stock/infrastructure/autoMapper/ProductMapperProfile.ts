import Product from 'Stock/domain/models/Product';
import { ProductDto } from '../dto/Product/ProductDto';
import { CreateProductDto } from '../dto/Product/CreateProductDto';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import ProductEntity from '../entity/ProductEntity';
import { Converter, Mapper, createMap } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';

@Injectable()
export class ProductMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ProductEntity, Product);
      createMap(mapper, Product, ProductDto);
      createMap(mapper, ProductDto, Product);
      createMap(mapper, CreateProductDto, Product);
    };
  }
}
