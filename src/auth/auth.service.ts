import { Body, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDto } from './dto/signup-user.dto';
import { v4 as uuidv4 } from 'uuid';


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

    async signup(signupUserDto: SignupUserDto) {
        const { email, username, password } = signupUserDto;

        const emailExists = await this.databaseService.user.findUnique({ where: { email } });
        if (emailExists) throw new ConflictException('Email already exists');
        const usernameExists = await this.databaseService.user.findUnique({ where: { username } });
        if (usernameExists) throw new ConflictException('Username already exists');
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = uuidv4();

        // creating user in db
        const newUser = await this.databaseService.user.create({
            data: {
                username, 
                email, 
                password: hashedPassword,
                verificationToken,
                verified: false
            }
        });

        // send verification email
        // await this.mailerService.sendMail({
        //     to: 'ahmdrzashn@gmail.com',
        //     from: 'mychatgptv1@gmail.com',
        //     subject: 'Testing Nest js',
        //     text: 'welcome',
        //     html: '<b>welcome</b>'
        // })
        console.log(verificationToken);

        return {
            status: 'success',
            message: 'signup successfull, please verify your email'
        }
    }

    async verifyEmail(token: string, email: string) { 
        const user = await this.databaseService.user.findUnique({ where: { email, verificationToken: token } });
        if (!user) throw new NotFoundException('email not verfied. verification token is wrong')

        await this.databaseService.user.update({ 
            where: { email },
            data: { verified: true }
        })

        return {
            status: 'success',
            message: 'user account verfied successfully'
        }
    }
}
