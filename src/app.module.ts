import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RessourceModule } from './Ressource/Ressource.module';
import { CitizenModule } from './citizen/citizen.module';

@Module({
  imports: [CitizenModule, RessourceModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
