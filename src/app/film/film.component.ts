import { Component, OnInit } from '@angular/core';
import {FilmsService} from "../services/films/films.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {


  public categories;
  public currentCategorie;
  public films;

  constructor(public filmsService:FilmsService,public  router:Router) { }

  ngOnInit(): void {
    this.filmsService.getCategories()
      .subscribe(response=>{
        this.categories = response;
      },error => {
        console.log(error)
      })
  }

  onGetFilms(c) {
    this.currentCategorie = c;
    this.filmsService.currentCategorie=c;
    this.filmsService.getFilms(c)
      .subscribe(response=>{
        this.films=response;
      },error => {
        console.log(error)
      })
  }

  onGetFilmsByTitle($event: Event) {
    console.log($event);
  }

  onFilmModify(f) {
    this.filmsService.currentFilm = f;
    this.router.navigate(['/addFilm']);
  }

  deleteFilm(f) {
    if(confirm("Est ce que vous etes sur de supprimer "+f.titre)){
      this.filmsService.deleteFilm(f)
        .subscribe(response=>{
          this.router.navigate(['/cinema']);
        },error => {
          console.log(error);
        })

    }

  }
}
