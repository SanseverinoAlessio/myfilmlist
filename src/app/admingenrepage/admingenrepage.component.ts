import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {GenreService} from '../genre.service';
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
  selector: 'app-admingenrepage',
  templateUrl: './admingenrepage.component.html',
  styleUrls: ['./admingenrepage.component.css'],
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
export class AdmingenrepageComponent implements OnInit {
  changeLoading = false;
  pageEvent:PageEvent
  searchSubject = new Subject<string>();
  query = '';
  length = 0;
  loading = false;
  genres:any = [];
  columndefs = ['id','name','options'];
  constructor(private genre:GenreService,private router:Router) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((query)=>{
      this.query = query;
      this.search();
    })
  }
  ngOnInit(): void {
    this.getGenres({
      page: 1
    });
  }
  getGenres(data){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.genre.getForGenreTable(data).subscribe((res)=>{
      this.loading = false;
      this.genres = res;
      this.length = this.genres.meta.totalItems;
    },err=>{
      this.loading = false;
      console.log('errore!');
    });
  }
  page(event:PageEvent){
    let page = event.pageIndex;
    page += 1;
    console.log(page);
    let perpage = event.pageSize;
    this.genres = [];
    this.getGenres({
      page:page,
      perpage: perpage,
    });
  }
  changeSearch(query){
    this.searchSubject.next(query);
  }
  deleteGenre(id){
    if(this.changeLoading == true){
      return;
    }
    this.changeLoading = true;
    this.genre.delete(id).subscribe((res)=>{
      this.changeLoading = false;
      this.length -= 1;
      this.removeFromArr(id);
    },err=>{
      this.changeLoading = false;
    });
  }
  removeFromArr(id){
    this.genres.result =  this.genres.result.filter((elem)=>{
      return elem._id != id ? elem : null;
    });
    if(this.genres.length <= 0){
      this.getGenres({
        page: 1
      });
    }
  }
  search(){
    if(this.loading == true){
      return;
    }
    if(this.query.length <= 0){
      this.genres = [];
      this.getGenres({
        page:1,
      });
      return;
    }
    this.genres = [];
    this.loading = true;
    this.genre.searchByName(this.query).subscribe((res)=>{
      this.loading = false;
      this.genres.result = res;
    },err=>{
      console.log('errore!');
    });
  }
  updateGenres(id){
    this.router.navigate(['/admin/genre/update',id]);
  }
}
