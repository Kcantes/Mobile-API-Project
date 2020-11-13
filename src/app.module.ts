import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmDocument, FilmSchema } from './Film';

@Module({
  imports: [MongooseModule.forRoot('mongodb://uht3sohis1mldn19adwf:IPX5vK92lnO71nHeJriF@bqxuj1qtyo7iqvb-mongodb.services.clever-cloud.com:27017/bqxuj1qtyo7iqvb'),MongooseModule.forFeature([{ name: FilmDocument.name, schema: FilmSchema }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
