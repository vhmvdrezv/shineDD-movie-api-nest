import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './database/database.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

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
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     auth: {
    //       user: 'ahmdrzashn@gmail.com',
    //       pass: 'Shn13811shn13811'
    //     }
    //   }
    // }),
    MyLoggerModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
