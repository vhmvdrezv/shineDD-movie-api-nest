import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';

@Injectable()
export class MoviesService {
    constructor(private readonly databaseService: DatabaseService) { };

    async findOne(id: number) {
        const movie = await this.databaseService.movie.findUnique({
            where: {
                id
            }
        });

        if (!movie) throw new NotFoundException(`movie with id ${id} not found.`);

        return {
            status: 'success',
            message: 'movie found',
            data: movie
        }
    }

    async findAll(filterMovieDto: FilterMovieDto) {
        const { genre, startDate, endDate, page = 1, limit = 3 } = filterMovieDto;

        const where: any = {
            genre: genre ? { equals: genre } : undefined,
            releaseDate: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
            status: filterMovieDto.status
        }

        const movies = await this.databaseService.movie.findMany({
            where,
            skip: (page - 1) * limit,
            take: Number(limit),
        });

        const total = await this.databaseService.movie.count({ where });
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;

        return {
            status: 'success',
            message: 'List of movies',
            data: movies,
            total,
            hasNext,
            hasPrevious,
        };
    }

    async create(createMovieDto: CreateMovieDto) {
        const newMovie = await this.databaseService.movie.create({
            data: createMovieDto
        });

        return {
            status: 'success',
            message: 'movie was created successfully.',
            data: newMovie
        };
    }

}

