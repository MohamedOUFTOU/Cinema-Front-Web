import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CinemaComponent } from './cinema/cinema.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule, } from "@angular/forms";
import { FilmComponent } from './film/film.component';
import { AddFilmComponent } from './film/add-film/add-film.component';
import {DatePipe} from "@angular/common";



@NgModule({
  declarations: [
    AppComponent,
    CinemaComponent,
    FilmComponent,
    AddFilmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
