import { Optional } from "@nestjs/common"
import { Genre, Status } from "@prisma/client"
import { Type } from "class-transformer"
import { IsDate, IsEnum, isEnum, IsNotEmpty, IsOptional, IsString, Max, MaxLength } from "class-validator"

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    title: string

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    releaseDate: Date

    @IsNotEmpty()
    @IsEnum(Genre)
    genre: Genre
    
    @IsNotEmpty()
    @IsEnum(Status)
    status: Status
}