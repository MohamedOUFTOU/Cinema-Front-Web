import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  public host:string = "http://localhost:8083/";
  constructor(private http:HttpClient) { }

  public getVilles(){
      return this.http.get(this.host+"villes");
  }

  public getCinemas(v){
     return this.http.get(v._links.cinemas.href);
  }

  getSalles(c){
    return this.http.get(c._links.salles.href);
  }

  getProjections(salle) {
    let url = salle._links.projections.href.replace("{?projection}","");
    return this.http.get(url+"?projection=p1");
  }

  getPlaces(p) {
    let url = p._links.tickets.href.replace("{?projection}","");
    return this.http.get(url+"?projection=ticketProj");
  }

  payerTickets(data) {
    return this.http.post(this.host+"payerTickets",data);
  }

  addVille(value) {
    return this.http.post(this.host+"villes",value);
  }

  addCinema(value) {
    return this.http.post(this.host+"cinemas",value);
  }

  addSalle(salle) {
    return this.http.post(this.host+"salles",salle);
  }

  addPlace(p) {
    return this.http.post(this.host+"places",p);
  }

  getSeances() {
    return this.http.get(this.host+"seances");
  }

  getFilms() {
    return this.http.get(this.host+"films");
  }

  addProjection(value) {
    return this.http.post(this.host+"projections",value);
  }

  getPlacesFromSalle(s) {
    return this.http.get(s._links.places.href);
  }

  getSallePlaces(s) {
    return this.http.get(s._links.places.href);
  }

  addTicket(ticket) {
    return this.http.post(this.host+"tickets",ticket);
  }
}
