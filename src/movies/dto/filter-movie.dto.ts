import { Genre, Status } from "@prisma/client";
import { Type } from "class-transformer";

import { IsEnum, IsInt, IsOptional, Matches, Min } from "class-validator";

export class FilterMovieDto {
    @IsOptional()
    @IsEnum(Genre)
    genre?: Genre

    @IsOptional()
    @IsEnum(Status)
    status?: Status

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'startDate must be in YYYY-MM-DD format',
    })
    startDate?: string

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'endDate must be in YYYY-MM-DD format',
    })
    endDate?: string

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}