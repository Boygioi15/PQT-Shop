import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from 'slugify';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument } from './product.schema';
import { Types } from 'mongoose';
import { ProductIdentifier } from './product.productIdentifier';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // async create(createProductDto: CreateProductDto) {
  //   if (createProductDto.name) {
  //     createProductDto.slug = slugify(createProductDto.name);
  //   }
  //   const newProduct = new this.productModel(createProductDto);

  //   newProduct.types.forEach((element) => {
  //     element._id = new Types.ObjectId();
  //     element.details.forEach((element1) => {
  //       element1._id = new Types.ObjectId();
  //     });
  //   });

  //   return await newProduct.save();
  // }

  // async findAllByCategory(categoryID: string) {
  //   return await this.productModel.find({ categoryRef: categoryID });
  // }

  // async findAll() {
  //   return await this.productModel.find();
  // }

  // async findOne(id: string) {
  //   return await this.productModel.findById(id);
  // }

  // async update(id: string, updateProductDto: UpdateProductDto) {
  //   return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
  //     new: true,
  //   });
  // }

  // async remove(id: string) {
  //   return await this.productModel.findByIdAndDelete(id);
  // }

  async create(createProductDto: CreateProductDto) {
    if (createProductDto.name) {
      createProductDto.slug = slugify(createProductDto.name);
    }
    const newProduct = new this.productModel(createProductDto);

    // Tạo ObjectId cho các phần tử bên trong types và details
    newProduct.types.forEach((element) => {
      element._id = new Types.ObjectId();
      element.details.forEach((element1) => {
        element1._id = new Types.ObjectId();
      });
    });

    return await newProduct.save();
  }

  async findAllByCategory(categoryID: string) {
    return await this.productModel
      .find({ categoryRef: categoryID })
      .populate('categoryRef', 'name')
      .populate('brandRef', 'name')
      .exec();
  }

  async findAll() {
    return await this.productModel
      .find()
      .populate('categoryRef', 'name')
      .populate('brandRef', 'name')
      .exec();
  }

  async findOne(id: string) {
    return await this.productModel
      .findById(id)
      .populate('categoryRef', 'name')
      .populate('brandRef', 'name')
      //  .populate('reviewsRef')
      .exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto.name) {
      updateProductDto.slug = slugify(updateProductDto.name);
    }
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.productModel.findByIdAndDelete(id);
  }

  async findByGender(gender: string) {
    return await this.productModel
      .find({ gender: gender })
      .populate('brandRef', 'name')
      .exec();
  }

  async findPopularProducts(limit: number) {
    return await this.productModel
      .find()
      .sort({ 'types.details.sold': -1 })
      .limit(limit)
      .populate('brandRef', 'name')
      .exec();
  }

  async findWithPaginationAndFilters(
    page: number = 1,
    limit: number = 10,
    brandIds: string[],
    colors: string[] = [],
    minPrice: number = 0,
    maxPrice: number = 0,
  ) {
    const query: any = {};

    if (brandIds.length > 0) {
      query['brandRef'] = { $in: brandIds.map((id) => new Types.ObjectId(id)) }; // Lọc theo mảng brandIds
    }

    if (colors.length > 0) {
      query['types.color_name'] = { $in: colors };
    }

    if (minPrice > 0 || maxPrice > 0) {
      query['types.details.price'] = {};
      if (minPrice > 0) {
        query['types.details.price'].$gte = minPrice;
      }
      if (maxPrice > 0) {
        query['types.details.price'].$lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    const products = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ 'types.details.price': 1 });

    const totalCount = await this.productModel.countDocuments(query);

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async searchProducts(query: string, page: number = 1, limit: number = 10) {
    const searchQuery = { $text: { $search: query } };

    const skip = (page - 1) * limit;

    const products = await this.productModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ score: { $meta: 'textScore' } });

    const totalCount = await this.productModel.countDocuments(searchQuery);

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async checkIfThereIsEnoughInStorage(
    productIdentifier: ProductIdentifier,
    quantity: number,
  ): Promise<{ enough; inStorage }> {
    const product = await this.productModel.findById(
      productIdentifier.productID,
    );
    const product_types = product.types;
    const product_type = product_types.find(
      (element) => element._id.toString() === productIdentifier.product_typeID,
    );
    const product_type_details = product_type.details;
    const product_type_detail = product_type_details.find(
      (element) =>
        element._id.toString() === productIdentifier.product_type_detailID,
    );

    const inStorage = product_type_detail.inStorage;
    if (inStorage < quantity) {
      return { enough: false, inStorage: inStorage };
    } else {
      return { enough: true, inStorage: inStorage };
    }
  }
}
