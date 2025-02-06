import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ReviewStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    @IsOptional()
    @IsEnum(ReviewStatus)
    status?: ReviewStatus
}
