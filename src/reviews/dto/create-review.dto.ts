import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateReviewDto {
    @IsNotEmpty()
    @MaxLength(100, { message: 'length of review must not be greater than 100 characters'})
    content: string
}
