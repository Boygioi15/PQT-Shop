import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/decorator/customize';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}
  @Post('/:productId')
  async createReview(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @User() user,
  ) {
    const userId = user.userId;
    return this.reviewService.createReview(productId, createReviewDto, userId);
  }

  @Patch(':id/edit')
  async updateReview(
    @Param('id') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @User() user,
  ) {
    const userId = user.userId;
    return this.reviewService.updateReview(reviewId, userId, updateReviewDto);
  }

  @Patch(':id/respond')
  async respondToReview(
    @Param('id') reviewId: string,
    @Body('response') response: string,
  ) {
    return this.reviewService.respondToReview(reviewId, response);
  }

  @Get()
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Post(':reviewId/like')
  async likeReview(@Param('reviewId') reviewId: string, @User() user) {
    return this.reviewService.likeReview(reviewId, user.userId);
  }

  // Dislike đánh giá
  @Post(':reviewId/dislike')
  async dislikeReview(@Param('reviewId') reviewId: string, @User() user) {
    return this.reviewService.dislikeReview(reviewId, user.userId);
  }
}
