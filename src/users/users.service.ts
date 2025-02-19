import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FilterUserDto } from './dto/filter-users.dto';
import { take } from 'rxjs';

@Injectable()
export class UsersService {

    constructor(private readonly databaseService: DatabaseService) { };

    async create(createUserDto: CreateUserDto) {
        const { password, ...user } = createUserDto;

        const usernameExists = await this.databaseService.user.findUnique({ where: { username: user.username } });
        if (usernameExists) throw new ConflictException('username exists, try another username')
        const emailExists = await this.databaseService.user.findUnique({ where: { email: user.email } });
        if (emailExists) throw new ConflictException('email exists, try another email')

        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.databaseService.user.create({
            data: {
                ...user,
                password: hashedPassword,
                verified: true
            }
        })

        return {
            status: 'success',
            message: 'user created successfully',
            data: newUser
        }
    }

    async findAll(filterUserDto: FilterUserDto) {
        const { page = 1, limit = 5 } = filterUserDto;
        const users = await this.databaseService.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                age: true,
                status: true,
            },
            skip: (page - 1) * limit,
            take: limit
        });
        const total = await this.databaseService.user.count();
        const totalPages = Math.ceil(total / limit);

        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return {
            status: 'success',
            message: 'list of users: ',
            data: users,
            hasNext, 
            hasPrev
        }
    }

    async findOne(id: number) {
        const user = await this.databaseService.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                age: true,
                status: true,
            }
        });

        if (!user) throw new NotFoundException(`user with id ${id} not found`);

        return {
            status: 'success', 
            message: 'user: ',
            data: user
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        return bcrypt.hash(password, saltRound);
    }
}
