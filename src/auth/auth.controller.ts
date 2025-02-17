import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './gaurds/passport-local.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { };

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
