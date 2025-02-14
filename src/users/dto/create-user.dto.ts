import { Role, Status } from "@prisma/client"

export class CreateUserDto {
    username: string
    email: string
    password: string
    role?: Role
    age?: number
    status: Status
}