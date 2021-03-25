import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {GenreService} from '../genre.service';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-create-genre',
  templateUrl: './create-genre.component.html',
  styleUrls: ['./create-genre.component.css']
})
export class CreateGenreComponent implements OnInit {
  requestError = false;
  success = false;
  loading = false;
  imagePreview = '../../assets/Images/photo_placeholder.jpg';
  fileError = '';
  title = '';
  loadingGenres = false;
  genreId = '';
  genreForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
    ]),
    file: new FormControl('',[
      Validators.required,
    ]),
    fileData: new FormControl('',[
      Validators.required,
    ])
  });
  constructor(private location:Location,private route:ActivatedRoute,private genre:GenreService,private router:Router) {
    this.route.params.subscribe((param)=>{
      if(param.id == undefined){
        this.title = 'Aggiungi un genere';
        return;
      }
      this.title = 'Aggiorna un genere';
      this.genreId = param.id;
      this.getGenre();
    });
  }
  ngOnInit(): void {
  }
  back(){
    this.location.back();
  }
  getGenre(){
    if(this.loadingGenres == true){
      return;
    }
    this.loadingGenres = true;
    this.genre.getById(this.genreId).subscribe((res:any)=>{
      this.loadingGenres = false;
      this.genreForm.get('name').setValue(res.name);
      for( const control in this.genreForm.controls ){
        if(control == 'file' || control == 'fileData'){
          this.genreForm.get(control).clearValidators();
          this.genreForm.get(control).updateValueAndValidity();
        }
      }
      this.imagePreview = environment.image  + res.photo;
    },err=>{
      console.log('errore!');
      this.loadingGenres = false;
      this.router.navigate(['/admin/genre']);
    });
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
    this.genreForm.get('fileData').setValue(file);
    let fileReader = new FileReader();
    fileReader.onloadend = (data:any)=>{
      this.imagePreview = data.currentTarget.result;
    }
    fileReader.readAsDataURL(file);
  }
  submit(){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    let data = {
      name: this.genreForm.value.name,
      file: this.genreForm.value.fileData.name != undefined ? this.genreForm.value.fileData : undefined,
    }
    if(this.genreId.length <= 0){
      this.createGenre(data);
    }
    else{
      this.updateGenre(data);
    }
  }
  createGenre(data){
    this.genre.createGenre(data).subscribe((res)=>{
      this.loading = false;
      this.success = true;
    },err=>{
      this.loading = false;
    });
  }
  updateGenre(data){
    data.id = this.genreId;
    this.genre.updateGenre(data).subscribe(()=>{
      this.loading = false;
      this.success = true;
    },err=>{
      this.loading = false;
      console.log('errore!');
    });
  }
}
