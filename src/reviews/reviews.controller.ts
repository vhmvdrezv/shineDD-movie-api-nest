import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/passport-jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('movies/:movieId/reviews')
  async create(@Request() req, @Param('movieId', ParseIntPipe) movieId: number, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, movieId, createReviewDto);
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
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('reviews/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
