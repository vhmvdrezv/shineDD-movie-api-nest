import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
    ) { };

    async validate(username: string, password: string) {
        const user = await this.databaseService.user.findUnique({ where: { username } });
        if (!user) return null;
        const result = await bcrypt.compare(password, user.password);
        if (result) return user;
        return null;   
    }

    async login(user: User) { 
        const payload = { sub: user.id, username: user.username };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            status: 'success',
            message: '',
            data: {
                accessToken
            }
        }
    }
}
