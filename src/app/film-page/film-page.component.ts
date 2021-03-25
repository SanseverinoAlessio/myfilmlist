import { Component, OnInit, } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FilmService} from '../film.service';
import {environment} from '../../environments/environment';
import {GenreService} from '../genre.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation,
} from '@angular/animations';
import {fadeIn} from '../fadeinAnim';
import { Location } from '@angular/common';
@Component({
  selector: 'app-film-page',
  templateUrl: './film-page.component.html',
  styleUrls: ['./film-page.component.css'],
  animations: [trigger('fadeIn',[
    transition(':enter',[
      useAnimation(fadeIn,{
        params:{
          translateYBefore: "-10px",
          translateYAfter: "0px",
        }
      })
    ]),
  ]),
]
})
export class FilmPageComponent implements OnInit{
  notFound = false;
  query = '';
  loadingGenres:boolean = false;
  genres;
  imagesPath = environment.image;
  films:any = [];
  genreName = '';
  loading:boolean = false;
  constructor(private filmService:FilmService,private genre:GenreService,private router:Router,
    private route:ActivatedRoute, private location:Location) {
      this.route.params.subscribe((param)=>{
        if(Object.keys(param).length <= 0){
          return;
        }
        this.films = [];
        if(param.genre != undefined){
          this.genreName = param.genre
          this.loading = true;
          this.getFilms({
            page:1,
            perpage:10,
            genre: this.genreName,
          });
        }
        if(param.query != undefined){
          this.query = param.query;
          this.search();
        }
      });
    }
    ngOnInit(): void {
      if(this.genreName.length <= 0 && this.query.length <= 0 ){
        this.loading = true;
        this.getFilms({
          page: 1,
          perpage: 10,
        });
      }
    }
    getFilms(data){
      this.filmService.getAllFilms({
        page: data.page,
        perpage:data.perpage,
        genre:data.genre
      }).subscribe((res:any)=>{
        this.loading = false;
        this.films = this.films.concat(res.result);
      }, err=>{
        this.loading = false;
      });
    }
    onScroll(){
      if(this.loading != false || this.query.length > 0){
        return;
      }
      let page = Math.ceil(this.films.length /10) +1;
      this.loading = true;
      this.getFilms({
        page: page,
        perpage:10,
        genre: this.genreName ?? '',
      });
    }
    search(){
      if(this.loading == true){
        return;
      }
      this.notFound = false;
      this.loading = true;
      this.filmService.searchByName(this.query).subscribe((res)=>{
        this.loading = false;
        this.films = res;
        if(this.films.length <= 0){
          this.notFound = true;
        }
      },err=>{
        this.loading = false;
      });
    }
  }
