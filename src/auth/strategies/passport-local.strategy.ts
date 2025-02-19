import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Status } from "@prisma/client";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validate(username, password);
        if (!user) throw new UnauthorizedException('username or password is wrong');
        if (user.status !== Status.active) throw new ForbiddenException('user account is not active');
        if (user.verified !== true) throw new ForbiddenException('user account is not verified');
        return user;
    }
}