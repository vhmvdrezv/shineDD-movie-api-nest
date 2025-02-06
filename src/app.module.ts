import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './database/database.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MoviesModule,
    DatabaseModule,
    ReviewsModule,
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 5000,
      limit: 5
    }, {
      name: 'long',
      ttl: 60000,
      limit: 66
    }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
