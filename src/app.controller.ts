import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Film, FilmDocument } from './Film';
import * as data from './films2.json';

@Controller('/films')
export class AppController {
  constructor(private readonly appService: AppService) {
    appService.deleteAll();
    //database init
    data.forEach(movie => {
      let film: Film = appService.createEmpty();
      for (var key in movie) {
        if (film.hasOwnProperty(key)) {
          if (key === "keywords"){
            film[key] = movie[key].split(",")
          }
          else if (key === "genres" || key === "authors" || key === "casting")
            film[key] = movie[key].split(", ")
          else
            film[key] = movie[key];
        }
      }
      appService.addFilm(film)
    })
  }

  @Get('')
  getFilms(@Query() queryElements) {
    return this.appService.getFilms(queryElements)
  }

  @Get('/genres')
  getGenres() {
    return this.appService.getGenres()
  }


  @Post('')
  postFilm(@Body() args) {
    if (!("authors" in args && "title" in args && "first_release_date" in args && "cover" in args))
      return "Not a film posted"
    let film: Film = this.appService.createEmpty();
    for (var key in args) {
      if (film.hasOwnProperty(key)) {
        film[key] = args[key];
      }
    }
    this.appService.addFilm(film);
    return film;
  }

  @Get(':film')
  getFilm(@Param() film) {
    return this.appService.getFilm(decodeURIComponent(film["film"]));
  }
  
  @Delete(':film')
  async deleteFilm(@Param() film) {
    let f:Film =await this.appService.getFilm(decodeURIComponent(film["film"]))
    this.appService.deleteFilm(decodeURIComponent(film["film"]))
    return f
  }

}
