import { Component, OnInit,ViewChild,AfterViewInit,ElementRef } from '@angular/core';
import {FilmService} from '../film.service';
import {Router,ActivatedRoute} from '@angular/router';
import {PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation
} from '@angular/animations';
import {fadeIn,fadeOut} from '../tableChangeAnim';
@Component({
  selector: 'app-adminfilmpage',
  templateUrl: './adminfilmpage.component.html',
  styleUrls: ['./adminfilmpage.component.css'],
  animations:[
    trigger('tableChange', [
      transition(':enter',[
        useAnimation(fadeIn),
      ]),
      transition(':leave',[
        useAnimation(fadeOut),
      ]),
    ]),
  ]
})
export class AdminfilmpageComponent implements OnInit,AfterViewInit {
  changeLoading = false;
  query:string = '';
  pageEvent: PageEvent;
  loading = false;
  films:any = [];
  columndefs = ['id','name','genre','options'];
  length;
  searchSubject = new Subject<string>();
  constructor(private film:FilmService,private router:Router,private route:ActivatedRoute) {
    this.searchSubject.pipe(
      debounceTime(500),
    ).subscribe((query)=>{
      this.query = query;
      if(query.length <= 0){
        this.getFilms({
          page:1,
          perpage: 10,
        });
        return;
      }
      this.search(query);
    });
  }
  ngOnInit(): void {
    this.getFilms({
      page:1,
      perpage: 10,
    });
  }
  ngAfterViewInit(){
  }
  changeSearch(query){
    this.searchSubject.next(query);
  }
  getFilms(data){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.film.getAllFilms({
      page: data.page,
      perpage: data.perpage,
      genre: data.genre,

    }).subscribe((res:any)=>{
      this.loading = false;
      this.films = res;
      this.length = this.films.meta.totalItems;
    });
  }
  updateFilm(id){
    this.router.navigate(['/admin/film/update',id]);
  }
  deleteFilm(id){
    if(this.changeLoading == true){
        return;
    }
    this.changeLoading = true;
    this.film.deleteFilm(id).subscribe((res)=>{
      this.changeLoading = false;
      this.length -= 1;
      this.removeFromArr(id);
    },err=>{
      this.changeLoading = false;
    })
  }
  removeFromArr(id){
    this.films.result =  this.films.result.filter((elem)=>{
      return elem._id != id ? true : false;
    });
    if(this.films.result.length <= 0){
      this.getFilms({
        page:1,
        perpage: 10,
      });
    }
  }
  page(event:PageEvent){
    let page = event.pageIndex;
    page += 1;
    let perpage = event.pageSize;
    this.films = [];
    this.getFilms({
      page: page,
      perpage:perpage,
      genre: '',
    });
  }
  search(query){
    if(this.loading == true){
      return true;
    }
    this.films = [];
    this.loading = true;
    this.film.searchByName(query).subscribe((res)=>{
      this.loading = false;
      this.films.result = res;
    },err=>{
      this.loading = false;
      console.log('errore!');
    });
  }

}
