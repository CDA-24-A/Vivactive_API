import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RessourceModule } from './Ressource/Ressource.module';
import { CommentModule } from './comment/comment.module';
import { CitizenModule } from './citizen/citizen.module';
import { StepModule } from './step/step.module';

@Module({
  imports: [CommentModule, CitizenModule, RessourceModule, StepModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
