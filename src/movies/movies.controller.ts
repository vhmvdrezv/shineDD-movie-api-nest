import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MoviesService) { };

    @Get()
    async findAll(@Query() filterMovieDto: FilterMovieDto) {
        return this.movieService.findAll(filterMovieDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.movieService.findOne(id);
    }
 
    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        return this.movieService.create(createMovieDto);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
        return this.movieService.update(id, updateMovieDto)
    }
}
