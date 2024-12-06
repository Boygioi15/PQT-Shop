import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/decorator/customize';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Public()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('category/:categoryId')
  @Public()
  findAllByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.findAllByCategory(categoryId);
  }

  @Get('popular')
  @Public()
  @Public()
  findPopularProducts(@Query('limit') limit: number) {
    return this.productService.findPopularProducts(limit || 10); // Mặc định lấy 10 sản phẩm phổ biến
  }

  @Get('gender/:gender')
  findByGender(@Param('gender') gender: string) {
    return this.productService.findByGender(gender);
  }

  @Get('fetch/:id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get('pagination')
  @Public()
  async findWithPaginationAndFilters(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('brands') brandIds: string[] = [],
    @Query('colors') colors: string[] = [],
    @Query('minPrice') minPrice: number = 0,
    @Query('maxPrice') maxPrice: number = 0,
  ) {
    return await this.productService.findWithPaginationAndFilters(
      page,
      limit,
      brandIds,
      colors,
      minPrice,
      maxPrice,
    );
  }

  @Get('/search')
  @Public()
  async search(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log('🚀 ~ ProductController ~ search:', query);
    return this.productService.searchProducts(query, page, limit);
  }

  @Get('/top-sale')
  @Public()
  async getTopSale(@Query('limit') limit: number) {
    return this.productService.getTopSale({ limit });
  }

  @Get('/get-new')
  @Public()
  async getNewProduct(@Query('limit') limit: number) {
    return this.productService.getListNewProduct({ limit });
  }
}
