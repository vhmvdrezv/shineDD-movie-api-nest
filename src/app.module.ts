import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './database/database.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [MoviesModule, DatabaseModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
