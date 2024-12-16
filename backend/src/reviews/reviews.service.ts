import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createReview(
    productId: string,
    createReviewDto: CreateReviewDto,
    userId: string,
  ) {
    const review = await this.reviewModel.create({
      ...createReviewDto,
      userRef: userId,
    });

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.reviewsRef.push(review._id as any);
    await product.save();

    return review;
  }

  // 2. Sửa đánh giá (chỉ được sửa 1 lần)
  async updateReview(reviewId: string, userId: string, updateReviewDto: any) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) throw new NotFoundException('Review not found');
    if (review.userRef.toString() !== userId)
      throw new BadRequestException('Unauthorized action');
    if (review.isEdited)
      throw new BadRequestException('Review can only be edited once');

    review.comment = updateReviewDto.comment || review.comment;
    review.rating = updateReviewDto.rating || review.rating;
    review.imageURLs = updateReviewDto.imageURLs || review.imageURLs;
    review.isEdited = true;

    return review.save();
  }

  // 3. Admin phản hồi đánh giá (chỉ được phản hồi 1 lần)
  async respondToReview(reviewId: string, response: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) throw new NotFoundException('Review not found');
    if (review.isResponded)
      throw new BadRequestException('Review already responded to');

    review.productResponse = response;
    review.isResponded = true;

    return review.save();
  }

  // 4. Lấy danh sách tất cả đánh giá
  async getAllReviews() {
    return this.reviewModel.find().exec();
  }

  async likeReview(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) throw new NotFoundException('Review not found');
    if (review.users_like.includes(userId)) {
      throw new BadRequestException('You have already liked this review');
    }

    review.users_like.push(userId);
    return review.save();
  }

  // 6. Dislike đánh giá
  async dislikeReview(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) throw new NotFoundException('Review not found');
    if (!review.users_like.includes(userId)) {
      throw new BadRequestException('You have not liked this review');
    }

    review.users_like = review.users_like.filter(
      (user) => user.toString() !== userId,
    );
    return review.save();
  }
}
