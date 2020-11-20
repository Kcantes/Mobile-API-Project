import { Injectable } from '@nestjs/common';
import { Film, FilmDocument } from './Film'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {
  private filmshelf: Film[] = []
  constructor(@InjectModel(FilmDocument.name) private FilmModel: Model<FilmDocument>) { }

  async addFilm(film: Film) {

    this.FilmModel.find(film).exec()
      .then(
        res => {
          if (res.length == 0)
            this.FilmModel.create(film);
        }
      )
  }

  async getFilm(name: string): Promise<Film> {
    let film = this.FilmModel.findOne({ 'title': name }).exec();
    return film;
  }

  async getFilms(queryElements): Promise<Film[]> {
    let regexAuthor = {};
    if ("author" in queryElements && queryElements["author"] != "")
      regexAuthor = { $or: [{ authors: { $regex: queryElements["author"], $options: 'i' } }, { casting: { $regex: queryElements["author"], $options: 'i' } }], }
    let regexSearch = {};
    if ("search" in queryElements && queryElements["search"] != "")
      regexSearch = { $or: [{ authors: { $regex: queryElements["search"], $options: 'i' } }, { casting: { $regex: queryElements["search"], $options: 'i' } }, { title: { $regex: queryElements["search"], $options: 'i' } }, { genres: { $regex: queryElements["search"], $options: 'i' } }, { keywords: { $regex: queryElements["search"], $options: 'i' } }], }
    let regexGenre = {};
    if ("genre" in queryElements && queryElements["genre"] != "")
      regexGenre = { genres: { $regex: queryElements["genre"], $options: 'i' } }
    let regexFinal = { $and: [regexAuthor, regexSearch, regexGenre] }
    let films = this.FilmModel.find(regexFinal)
    let mysort:any
    if ("sort-by" in queryElements && queryElements["sort-by"] != "") {
      let ascen = 1;
      if ("asc" in queryElements && queryElements["asc"] != "")
        if (queryElements["asc"] == "-1")
          ascen = -1;
      mysort = { [queryElements["sort-by"]]: ascen }
    }
    else{
      mysort = { "first_release_date": -1 }
    }
    films=films.sort(mysort)
    if ("limit" in queryElements && queryElements["limit"] != "" && queryElements["limit"] != 0 && queryElements["limit"] != "0") {
      films = films.limit(queryElements["limit"])
    }
    return films.exec();
  }

  async getGenres(): Promise<any> {
    return this.FilmModel.distinct('genres').exec()
  }

  createEmpty() {
    return {
      title: "",
      url: "",
      summary: "",
      aggregated_rating: 0,
      authors: [],
      casting: [],
      genres: [],
      keywords: [],
      first_release_date: "",
      runtime: 0,
      cover: "",
      members: 0,
      size: 0,
      date_added: ""
    } as Film
  }

  async getTotalNumberOfFilms() {
    return this.FilmModel.countDocuments().exec();
  }

  async deleteFilm(name: string) {
    this.getFilm(name).then(res => {
      if (res != undefined && res != null) {
        this.FilmModel.deleteOne({ 'title': name }).exec();
      }
    }
    )
  }

  async deleteAll() {
    this.FilmModel.deleteMany({}).exec();
  }
  //El famoso fizzbuzz
  fizzbuzz(n: number) {
    return (((n % 15 == 0)) && "fizzbuzz") || (((n % 3 == 0)) && "fizz") || (((n % 5 == 0)) && "buzz")
  }
}