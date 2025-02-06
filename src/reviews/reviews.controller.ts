import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewsDto } from './dto/filter-reviews.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('movies/:movieId/reviews')
  async create(@Param('movieId', ParseIntPipe) movieId: number, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(movieId, createReviewDto);
  }

  @Get('movies/:movieId/reviews')
  async findAll(@Param('movieId', ParseIntPipe) movieId: number, @Query() filterReviewsDto: FilterReviewsDto) {
    return this.reviewsService.findAll(movieId, filterReviewsDto);
  }

  @Get('/reviews')
  async findAllReviews(@Query() filterReviewsDto: FilterReviewsDto) {
    return this.reviewsService.findAllReviews(filterReviewsDto)
  }

  @Get('reviews/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }


  @Patch('reviews/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete('reviews/:id')
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
