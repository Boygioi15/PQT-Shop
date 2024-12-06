import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDocument } from './category.schema';
import { ProductDocument } from 'src/product/product.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const newProduct = new this.categoryModel(createCategoryDto);
    return await newProduct.save();
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findByID(id: string) {
    return await this.categoryModel.findById(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const categoryToRemove = await this.categoryModel.findById(id);

    if (!categoryToRemove) {
      throw new Error('Category not found');
    }

    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryModel.findByIdAndDelete(id);

    return { message: `Category with ID ${id} successfully deleted` };
  }
}
