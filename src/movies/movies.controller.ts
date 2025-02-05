import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';

@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MoviesService) { };

    @Get()
    async findAll(@Query(ValidationPipe) filterMovieDto: FilterMovieDto) {
        return this.movieService.findAll(filterMovieDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.movieService.findOne(id);
    }
 
    @Post()
    async create(@Body(ValidationPipe) createMovieDto: CreateMovieDto) {
        return this.movieService.create(createMovieDto);
    }
}
