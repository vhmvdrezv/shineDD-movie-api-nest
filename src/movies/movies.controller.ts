import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMovieDto } from './dto/filter-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/gaurds/passport-jwt.guard';


@Controller('movies')
@UseGuards(ThrottlerGuard) 
export class MoviesController {
    constructor(private readonly movieService: MoviesService) { };
  
    @Get()
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findAll(@Request() req, @Query() filterMovieDto: FilterMovieDto) {
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
