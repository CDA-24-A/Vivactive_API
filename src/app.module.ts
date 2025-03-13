import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { CitizenModule } from './citizen/citizen.module';

@Module({
  imports: [CommentModule, CitizenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
