import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from  '@angular/common/http';
import {environment} from './../environments/environment';
interface film{
  filmId:string,
  vote: number,
  state:string,
}
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  openUpdateList = new Subject<Object>();
  openUpdateListOb = this.openUpdateList.asObservable();
  updatedFilm = new Subject<Object>();
  updateFilmOb = this.updatedFilm.asObservable();
  constructor(private http:HttpClient) { }
  updateFilmVal(val:{
    state:string,
    vote: string,
    filmId: string,
  }){
    this.updatedFilm.next(val);
  }
  openUpdatePage(value){
    this.openUpdateList.next(value);
  }
  addFilm(data:film){
    return this.http.post(environment.server + '/api/list/addFilm',data);
  }
  updateFilm(data:film){
    return this.http.put(environment.server + '/api/list/film/' + data.filmId,data);
  }
  getList(data:{
    state:string
    page:number,
    perpage?:number,
  }){
    let perpage = data.perpage || 10;
    return this.http.get(environment.server + '/api/list/films/' + '?page=' + data.page + '&perpage=' + perpage + "&state=" + data.state);
  }
  removeFilm(id){
    return this.http.delete(environment.server + '/api/list/film/' + id);
  }
  getFilm(id){
    return this.http.get(environment.server + '/api/list/film/' + id);
  }
  search(name){
    return this.http.get(environment.server + '/api/list/film/search/' + name);
  }
}
