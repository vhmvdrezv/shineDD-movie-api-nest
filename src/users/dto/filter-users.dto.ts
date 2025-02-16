import { Type } from "class-transformer"
import { IsInt, IsOptional, Min } from "class-validator"

export class FilterUserDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number
}