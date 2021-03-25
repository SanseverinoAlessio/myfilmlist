import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {GenreService} from '../genre.service';
@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.css'],
})
export class FilmComponent implements OnInit {
  loadingGenres= false;
  genres;
  constructor(private router:Router,private genre:GenreService){
  }
  ngOnInit(){
    this.getGenres();
  }
  getGenres(){
    if(this.loadingGenres == true){
      return;
    }
    this.loadingGenres = true;
    this.genre.getAll().subscribe((res:any)=>{
      this.loadingGenres = false;
      this.genres = res;
      return;
    },err=>{
      console.log('errore');
      return;
    });
  }
}
