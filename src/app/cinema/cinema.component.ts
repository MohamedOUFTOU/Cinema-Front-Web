import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";
import {Router} from "@angular/router";
import {FilmsService} from "../services/films/films.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public isProjection:boolean = false;
  public  villes;
  public  cinemas;
  public salles;
  public currentVille;
  public  currentCinema;
  public currentProjection;
  public selectedTicket;
  public addVille: boolean=false;
  addCinema: boolean =false;
  public currentAdedCinema;
  public currentAdedSalles=[];
  showSalles: boolean =true;
  public currentSalle;
  public seances;
  public slectedSeance;
  public films;
  public selectedFilm;
  private places;
  private projectionAdded;
  constructor(public cinemaService:CinemaService, public router:Router) { }

  ngOnInit(): void {
    this.addVille=false;
    this.cinemaService.getVilles()
      .subscribe(data =>{
        this.villes = data;
      },error => {
        console.log(error);
      })
  }

  onGetCinemas(v){
    this.currentVille = v;
    this.cinemas = undefined;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data =>{
        this.cinemas = data;
      },error => {
        console.log(error);
      })
  }

  onGestSalles(c){
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data =>{
        this.salles = data;
        this.salles._embedded.salles.forEach(salle =>{

          this.cinemaService.getProjections(salle)
            .subscribe(data =>{
              salle.projections = data;
              if(salle.projections._embedded.projections.length > 0){
                salle.isProjection = true;
              }else {
                salle.isProjection = false;
              }
            },error => {
              console.log(error);
            })

        })
      },error => {
        console.log(error);
      })
  }

  onGetPlaces(p) {

    this.currentProjection = p;
    this.cinemaService.getPlaces(p)
      .subscribe(data =>{
        this.currentProjection.tickets = data;
        this.selectedTicket = [];
      },error => {
        console.log(error);
      })
  }

  onSelectTicket(t) {

    if(!t.selected){
      t.selected = true
      this.selectedTicket.push(t);
    }else {
      t.selected = false
      this.selectedTicket.splice(this.selectedTicket.indexOf(t),1);
    }
  }

  getTicketClass(t) {
    let str = "btn Nreserve ";
    if(t.reserve){
      str+="btn-danger"
    }else if(t.selected){
      str+="btn-warning"
    }else {
      str+="btn-success"
    }
    return str;
  }

  onPayTickets(data) {
    let tickets = [];
    this.selectedTicket.forEach(t=>{
      tickets.push(t.id)
    })
    data.ticketsId = tickets
    this.cinemaService.payerTickets(data)
      .subscribe(data =>{
        alert("Paiment est passé avec Success !!!!!!");
        this.onGetPlaces(this.currentProjection);
      },error => {
        console.log(error);
      })

  }

  showVilleForm() {
    this.addVille = !this.addVille;
  }

  onAddVille(value) {
    this.cinemaService.addVille(value)
      .subscribe(response=>{
        this.ngOnInit();
      },error => {
        console.log(error);
      })

  }

  showFormCinema() {
    this.addCinema = !this.addCinema;
    this.showSalles =!this.showSalles;
  }

  onAddCinema(value) {
    value.ville = this.currentVille._links.self.href;
    this.cinemaService.addCinema(value)
      .subscribe(response =>{
        this.currentAdedCinema = response;
        for (let i = 0; i < this.currentAdedCinema.nombreSalles; i++){
          this.currentAdedSalles.push({"nom":"Salle "+(i+1),"nombrePlace":0,"cinema":this.currentAdedCinema._links.self.href})
        }

      },error => {
        console.log(error);
      })
  }

  addSalles() {

    this.currentAdedSalles.forEach(salle =>{
      let places = [];
      this.cinemaService.addSalle(salle)
        .subscribe(response=>{
          salle = response;
          //console.log(response);
          for (let i = 0; i < salle.nombrePlace; i++){
            places.push({"numero":(i+1),"salle":salle._links.self.href})
          }
          places.forEach(place=>{
            this.cinemaService.addPlace(place)
              .subscribe(response=>{
                this.addCinema=false;
                this.showSalles=true;
                this.onGetCinemas(this.currentVille);
              },error => {
                console.log(error);
              })
          })
        },error => {

        })
    })
  }

  showFormProjection(s) {
    this.currentSalle = s;
    s.isProjection = !s.isProjection;
    this.getSeances();
    this.getFilms();
  }

  getSeances(){
    this.cinemaService.getSeances()
      .subscribe(response=>{
        this.seances = response;
      },error => {
        console.log(error);
      })
  }
  onaddProjection(value) {

    value.salle = this.currentSalle._links.self.href;
    this.cinemaService.addProjection(value)
      .subscribe(response=>{
        this.projectionAdded = response;
        this.onGetPlacesFromSalle(this.currentSalle);
      },error => {
        console.log(error);
      })
  }

  private getFilms() {
    this.cinemaService.getFilms()
      .subscribe(response=>{
        this.films = response;
      },error => {
        console.log(error)
      })
  }

  previewFilm(film) {
    this.selectedFilm = film.split("/")[film.split("/").length-1];
  }

  onGetPlacesFromSalle(s){
    let tickets = [];
    this.cinemaService.getSallePlaces(s)
      .subscribe(response=>{
        this.places = response;
        this.places._embedded.places.forEach(place=>{
          tickets.push({"prix":this.projectionAdded.prix,"reserve":false,"salle":this.currentSalle._links.self.href,"projection":this.projectionAdded._links.self.href,"place":place._links.self.href});
        })
        tickets.forEach(ticket=>{
          this.cinemaService.addTicket(ticket)
            .subscribe(response=>{
              console.log(response);
            },error => {
              console.log(error);
            })
        })
      },error => {
        console.log(error);
      })
    this.currentSalle.isProjection = !this.currentSalle.isProjection;
    this.onGestSalles(this.currentCinema);
  }
}
