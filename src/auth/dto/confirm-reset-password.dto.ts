import { IsNotEmpty } from "class-validator"

export class ConfirmResetPasswordDto {

    @IsNotEmpty()
    newPassword: string

    @IsNotEmpty()
    token: string
}