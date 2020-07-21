import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CinemaComponent} from "./cinema/cinema.component";
import {FilmComponent} from "./film/film.component";
import {AddFilmComponent} from "./film/add-film/add-film.component";


const routes: Routes = [
  {
    path: 'cinema',
    component: CinemaComponent
  },
  {
    path: 'films',
    component: FilmComponent
  },
  {
    path: 'addFilm',
    component: AddFilmComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
