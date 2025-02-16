import { Role, Status } from "@prisma/client"
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string

    @IsOptional()
    @IsEnum(Role)
    role?: Role

    @IsOptional()
    @IsInt()
    @Min(5)
    @Max(100)
    age?: number

    @IsOptional()
    @IsEnum(Status)
    status?: Status
}