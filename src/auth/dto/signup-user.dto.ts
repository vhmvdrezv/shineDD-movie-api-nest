import { IsEmail, IsNotEmpty } from "class-validator"

export class SignupUserDto { 

    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsEmail()
    email: string
}