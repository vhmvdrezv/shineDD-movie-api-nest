import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './gaurds/passport-local.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './gaurds/passport-jwt.guard';
import { SignupUserDto } from './dto/signup-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ConfirmForgetPassword } from './dto/confirm-forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto copy';
import { ConfirmResetPasswordDto } from './dto/confirm-reset-password.dto';

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

    @Post('forget-password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
        return this.authService.forgetPassword(forgetPasswordDto);
    }

    @Post('confirm-forget-password')
    async confirmForgetPassword(@Body() confirmForgetPasswordDto: ConfirmForgetPassword) {
        return this.authService.confirmForgetPassword(confirmForgetPasswordDto);   
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.forgetPassword(resetPasswordDto);
    }

    @Post('confirm-reset-password')
    async confirmResetPassword(@Body() confirmResetPassword: ConfirmResetPasswordDto) {
        return this.authService.confirmForgetPassword(confirmResetPassword);
    }
}
