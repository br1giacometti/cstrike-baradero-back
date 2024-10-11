import { Module } from '@nestjs/common';
import { ProductMapperProfile } from '../autoMapper/ProductMapperProfile';
import ProductController from '../controller/ProductController';
import ProductService from 'Stock/application/service/ProductService';
import ProductDataProvider from '../dataProvider/ProductDataProvider';
import ProductRepository from 'Stock/application/repository/ProductRepository';
import ProductValidations from 'Stock/application/validations/ProductValidations';
import CategoryController from '../controller/CategoryController';
import CategoryService from 'Stock/application/service/CategoryService';
import CategoryRepository from 'Stock/application/repository/CategoryRepository';
import CategoryDataProvider from '../dataProvider/CategoryDataProvider';
import CategoryValidations from 'Stock/application/validations/CategoryValidations';
import { CategoryMapperProfile } from '../autoMapper/CategoryMapperProfile';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProductController, CategoryController],
  imports: [HttpModule],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductDataProvider,
    },
    ProductMapperProfile,
    ProductValidations,
    CategoryService,
    CategoryValidations,
    {
      provide: CategoryRepository,
      useClass: CategoryDataProvider,
    },
    CategoryMapperProfile,
  ],
})
export default class StockModule {}
