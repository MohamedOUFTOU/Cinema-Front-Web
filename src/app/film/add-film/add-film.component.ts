import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import {FilmsService} from "../../services/films/films.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-add-film',
  templateUrl: './add-film.component.html',
  styleUrls: ['./add-film.component.css']
})
export class AddFilmComponent implements OnInit {

  imageURL: string;
  uploadForm: FormGroup;
  selectedFile: File;
  currentFilm;

  constructor(public fb: FormBuilder,public filmsService:FilmsService,private router:Router,public datePipe:DatePipe) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      name: ['']
    })
  }

  ngOnInit(): void {
    this.currentFilm = this.filmsService.currentFilm;
    if(this.currentFilm){
      //this.currentFilm.dateSortie = this.datePipe.transform(this.currentFilm.dateSortie,'dd/MM/yyyy');
      delete this.currentFilm._links;
      console.log(this.currentFilm);
    }

  }



  showPreveiw(event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    const file = (event.target as HTMLInputElement).files[0];
    this.uploadForm.patchValue({
      avatar: file
    });
    this.uploadForm.get('avatar').updateValueAndValidity()


    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  onSaveFilm(data) {
    data.photo = data.titre.replace(/\s/g,"")+".jpg";
    data.categorie = this.filmsService.currentCategorie._links.self.href;
    this.filmsService.saveFilm(data)
      .subscribe(response=>{
        console.log(response);
        this.uploadFilmPoster(data.photo);
      },error => {
        console.log(error);
      })
    this.router.navigate(['/films']);
  }

  uploadFilmPoster(fileName:string){
    const uploadImageData = new FormData();
    uploadImageData.append('photo', this.selectedFile, fileName);
    this.filmsService.uploadFilmImage(uploadImageData)
      .subscribe(data =>{
        console.log(data)
      },error => {
        console.log(error)
      })
  }

  onUpdateFilm() {
    if(this.selectedFile){
      this.uploadFilmPoster(this.currentFilm.titre.replace(/\s/g,"")+".jpg");
    }
    this.filmsService.updateFilm(this.currentFilm)
      .subscribe(response=>{
        alert("Le film a été modifié avec success !!!!");
        this.router.navigate(['/films']);
      },error => {
        console.log(error);
      })
  }
}
