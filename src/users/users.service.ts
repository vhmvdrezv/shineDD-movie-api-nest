import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly databaseService: DatabaseService) { };

    async create(createUserDto: CreateUserDto) {
        
    }
}
