import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../role.enum";
import { Request } from "express";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    async canActivate(context: ExecutionContext) {
    
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass
        ]);

        if (!requiredRoles) return true; 

        const request = context.switchToHttp().getRequest();

        const user = request.user;
        
        if (!user) return false

        return requiredRoles.includes(user.role)
    }
}