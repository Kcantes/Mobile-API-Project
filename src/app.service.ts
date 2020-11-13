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
    if ("author" in queryElements)
      regexAuthor = { $or: [{ authors: { $regex: queryElements["author"], $options: 'i' } }, { casting: { $regex: queryElements["author"], $options: 'i' } }], }
    let regexSearch = {};
    if ("search" in queryElements)
      regexSearch = { $or: [{ authors: { $regex: queryElements["search"], $options: 'i' } }, { casting: { $regex: queryElements["search"], $options: 'i' } }, { title: { $regex: queryElements["search"], $options: 'i' } }, { genres: { $regex: queryElements["search"], $options: 'i' } }, { keywords: { $regex: queryElements["search"], $options: 'i' } }], }
    let regexGenre = {};
    if ("genre" in queryElements)
      regexGenre = { genres: { $regex: queryElements["genre"], $options: 'i' } }
    let regexFinal = { $and: [regexAuthor, regexSearch, regexGenre] }
    if ("sort-by" in queryElements) {
      let ascen = 1;
      if ("asc" in queryElements)
        if (queryElements["asc"] == "-1")
          ascen = -1;
      let mysort = {[queryElements["sort-by"]]:ascen};
      let films = this.FilmModel.find(regexFinal).sort(mysort).exec();
      return films;
    }
    else {
      let films = this.FilmModel.find(regexFinal).sort({ "first_release_date": -1 }).exec();
      return films;
    }
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