import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FilmsService {

  public host:string = "http://localhost:8083/";
  public currentCategorie;
  public currentFilm;
  constructor(private http:HttpClient) { }


  getCategories() {
    return this.http.get(this.host+"categories");
  }

  setCategoie(c){
    this.currentCategorie = c;
  }

  getFilms(c) {
    return this.http.get(c._links.films.href);
  }

  uploadFilmImage(uploadImageData: FormData) {
    return this.http.post(this.host+"upload",uploadImageData);
  }

  saveFilm(data) {
    return this.http.post(this.host+"films",data);
  }

  updateFilm(currentFilm) {
    return this.http.put(this.host+"films/"+currentFilm.id,currentFilm);
  }

  deleteFilm(f) {
    return this.http.delete(this.host+"films/"+f.id);
  }
}
