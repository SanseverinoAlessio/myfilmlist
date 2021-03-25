import { Component, OnInit,ViewChild,HostListener } from '@angular/core';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y,Mousewheel } from 'swiper/core';
import {GenreService} from '../genre.service';
import {environment} from '../../environments/environment';
import {FilmService} from '../film.service';
SwiperCore.use([Navigation, Mousewheel]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  topFilms:any = [];
  genres = [];
imagesPath = environment.image;
  constructor(private genre:GenreService, private film:FilmService) {
    this.getAllGenres();
    this.getTopFilms();
  }
  ngOnInit(): void {
  }
  width(){
   if(window.innerWidth <= 500){
      return 1;
    }
    else if(window.innerWidth <= 768){
      return 2;
    }
    else if(window.innerWidth > 768){
      return 4;
    }
  }
  getAllGenres(){
    this.genre.getAll().subscribe((res:any)=>{
      this.genres = res;
    },err=>{
      console.log('errore!');
    });
  }
  getTopFilms(){
    this.film.getTopFilms().subscribe((res)=>{
      this.topFilms = res;
    },err=>{
      console.log('errore!');
    });
  }
}
