import { Component, OnInit } from '@angular/core';
import {GenreService} from '../genre.service';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import {Router} from '@angular/router'
import {FilmService} from '../film.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-createfilm',
  templateUrl: './createfilm.component.html',
  styleUrls: ['./createfilm.component.css']
})
export class CreatefilmComponent implements OnInit {
  checkedGenres:any = [];
  requestError = false;
  loadingFilm = false;
  imagePath = environment.image;
  filmId = '';
  title = 'Aggiungi un film!'
  error = '';
  imagePreview = '../../assets/Images/photo_placeholder.jpg';
  genres = [];
  loading = false;
  success = false;
  fileError = '';
  filmForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
    ]),
    description: new FormControl('',[
      Validators.required,
      Validators.minLength(100),
      Validators.maxLength(400),
    ]),
    genre: new FormControl('',[
      Validators.required,
    ]),
    file: new FormControl('',[
      Validators.required,
    ]),
    fileData: new FormControl('',[
      Validators.required,
    ]),
    releaseDate: new FormControl('',[
      Validators.required,
    ]),
  })
  constructor(private genre:GenreService, private location:Location,private film:FilmService, private route:ActivatedRoute,private router:Router) {
    this.route.params.subscribe((param)=>{
      if(param.id == undefined){
        return;
      }
      this.title = 'Aggiorna un film';
      this.filmId = param.id;
      this.getFilm();
    });
  }
  ngOnInit(): void {
    this.getGenres();
  }
  getGenres(){
    this.genre.getAll().subscribe((res:any)=>{
      this.genres = res;
    },err=>{
      console.log('errore!');
    });
  }
  back(){
    this.location.back();
  }
  onFileChange($event){
    let e:any = event;
    let file = e.srcElement.files[0];
    let regex = new RegExp("\/(gif|jpe?g|png|webp|bmp)");
    this.fileError = '';
    if(file == undefined){
      return;
    }
    if((file.size/1024)/1024 < 200 == false){
      this.fileError = 'Il file è troppo grande';
      return;
    }
    if(!regex.exec(file.type)){
      this.fileError = 'Il formato non è valido';
      return;
    }
    this.filmForm.get('fileData').setValue(file);
    let fileReader = new FileReader();
    fileReader.onloadend = (data:any)=>{
      this.imagePreview = data.currentTarget.result;
    }
    fileReader.readAsDataURL(file);
  }
  submit(){
    if(this.loading == true || this.filmForm.valid == false){
      return;
    }
    this.success = false;
    this.requestError = false;
    this.loading = true;
    let data = {
      name: this.filmForm.value.name,
      description: this.filmForm.value.description,
      genres: this.filmForm.value.genre,
      file:this.filmForm.value.fileData.name ? this.filmForm.value.fileData : undefined,
      releaseDate: this.filmForm.value.releaseDate,
    }
    if(this.filmId.length <= 0){
      this.addFilm(data);
    }
    else{
      this.updateFilm(data);
    }
  }
  addFilm(data){
    this.film.addFilm(data).subscribe((res)=>{
      this.success = true;
      this.loading = false;
    },err=>{
      this.loading = false;
      this.requestError = false;
    });
  }
  updateFilm(data){
    data.id = this.filmId;
    this.film.updateFilm(data).subscribe((res)=>{
      this.success = true;
      this.loading = false;
    },err=>{
      this.loading = false;
      this.requestError = false;
    })
  }
  getFilm(){
    if(this.loadingFilm == true){
      return;
    }
    this.loadingFilm = true;
    this.film.getFilm(this.filmId).subscribe((res:any)=>{
      this.checkedGenres = (()=>{
      return res.genre.map((elem)=>{
          return elem._id;
        });
      })();

console.log(this.checkedGenres);

      this.loadingFilm = false;
      this.filmForm.get('name').setValue(res.name);
      this.filmForm.get('description').setValue(res.description);
      this.filmForm.get('genre').setValue(res.genre.name);
      this.filmForm.get('releaseDate').setValue(res.releaseDate);
      for( const control in this.filmForm.controls ){
        if(control == 'file' || control == 'fileData'){
          this.filmForm.get(control).clearValidators();
          this.filmForm.get(control).updateValueAndValidity();
        }
      }
      this.imagePreview = this.imagePath + res.image;
    },err=>{
      this.loadingFilm = false;
      this.router.navigate(['/admin/film']);
    });
  }

}
