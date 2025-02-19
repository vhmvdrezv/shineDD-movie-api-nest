import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './gaurds/passport-local.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './gaurds/passport-jwt.guard';
import { SignupUserDto } from './dto/signup-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { };

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('signup')
    async signup(@Body() signupUserDto: SignupUserDto) {
        return this.authService.signup(signupUserDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getUserInfo(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Query('email') email: string) {
        return this.authService.verifyEmail(token, email);
    }
}
