import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { FilterUserDto } from './dto/filter-users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { };

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto); 
    }

    @Get()
    async findAll(@Query() filterUserDto: FilterUserDto) {
        return this.usersService.findAll(filterUserDto);
    }
}
