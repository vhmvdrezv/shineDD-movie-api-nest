import { IsEmail, IsNotEmpty } from "class-validator"

export class ConfirmForgetPassword {
    @IsNotEmpty()
    token: string

    @IsNotEmpty()
    newPassword: string
}