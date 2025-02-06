import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewsDto } from './dto/filter-reviews.dto';
import { DatabaseService } from 'src/database/database.service';
import { take } from 'rxjs';

@Injectable()
export class ReviewsService {

  constructor(private readonly databaseService: DatabaseService) { };

  async create(movieId: number, createReviewDto: CreateReviewDto) {

    // it should be replace by adding exception filters
    const movieExists = await this.databaseService.movie.findUnique({ where: { id: movieId } });
    if (!movieExists) throw new NotFoundException(`movie with id ${movieId} not found`);

    const newReview = await this.databaseService.review.create({
      data: {
        movieId,
        content: createReviewDto.content,
        status: 'PENDING'
      }
    });

    return {
      status: 'success',
      message: 'review created successfully',
      data: newReview
    }
  }

  async findAll(movieId: number, filterReviewsDto: FilterReviewsDto) {

    const { page = 1, limit = 5 } = filterReviewsDto;

    const where = {
      movieId,
      status: filterReviewsDto.status
    }

    const movieExists = await this.databaseService.movie.findUnique({ where: { id: movieId } });
    if (!movieExists) throw new NotFoundException(`movie with id ${movieId} not found.`);

    const reviews = await this.databaseService.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await this.databaseService.review.count({
      where,
    });
    
    const totalPages = Math.ceil(total/limit);
    const hasNext: boolean = page < totalPages;
    const hasPrev: boolean = page > 1;

    return {
      status: 'success',
      message: `list of reviews of movie with id ${movieId}: `,
      data: reviews,
      hasNext,
      hasPrev
    }

  }

  async findAllReviews(filterReviewsDto: FilterReviewsDto) {
    const { page = 1, limit = 5 } = filterReviewsDto;

    const where = {
      status: filterReviewsDto.status
    }

    const reviews = await this.databaseService.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await this.databaseService.review.count({
      where,
    });
    
    const totalPages = Math.ceil(total/limit);
    const hasNext: boolean = page < totalPages;
    const hasPrev: boolean = page > 1;

    return {
      status: 'success',
      message: `list of reviews: `,
      data: reviews,
      hasNext,
      hasPrev
    }
  }

  async findOne(id: number) {
    const review = await this.databaseService.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException(`review with id ${id} not found.`);

    return {
      status: 'success',
      message: 'Review: ',
      data: review
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const reviewExists = await this.databaseService.review.findUnique({ where:  { id } });
    if (!reviewExists) throw new NotFoundException(`review with id ${id} not found.`);

    const updatedReview = await this.databaseService.review.update({
      where: {
        id
      },
      data: updateReviewDto
    });

    return {
      status: 'succues',
      message: `review with id ${id} updated`,
      data: updatedReview
    }
  }

  async remove(id: number) {
    const reviewExists = await this.databaseService.review.findUnique({ where:  { id } });
    if (!reviewExists) throw new NotFoundException(`review with id ${id} not found.`);

    await this.databaseService.review.delete({ where: { id } });
    return {
      status: 'succues',
      message: `review with id ${id} deleted`,
    }
  }
}
