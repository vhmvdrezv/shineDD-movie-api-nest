import { PartialType } from "@nestjs/mapped-types";
import { CreateMovieDto } from "./create-movie.dto";
import { Status } from "@prisma/client";

export class UpdateMovieDto extends PartialType(CreateMovieDto) { 
    status?: Status
};