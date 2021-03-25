import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FilmService {
  constructor(private http:HttpClient) { }
  getAllFilms(data:{
    page:number,
    perpage:number,
    genre?:string
  }){
    let genre = data.genre ?? '';
    return this.http.get(environment.server + '/api/film?' + 'page=' + data.page + '&perpage=' + data.perpage + '&genre=' + genre);
  }
  getFilm(id){
    return this.http.get(environment.server + '/api/film/single/' + id);
  }
  searchByName(name){
    return this.http.get(environment.server + '/api/film/search/' + name);
  }
  addFilm(data:{
    file:any,
    name:string,
    description:string,
    genres:Array<string>,
    releaseDate:any,
  }) {
    let fileData = new FormData();
    fileData.append('name',data.name);
    fileData.append('description',data.description);
    for(let i = 0; i < data.genres.length; i++){
      fileData.append('genres[]',data.genres[i]);
    }
    fileData.append('photo',data.file,data.file.name);
    fileData.append('releaseDate',data.releaseDate);
    return this.http.post(environment.server + '/api/film',fileData);
  }
  updateFilm(data:{
    file?:any
    id:string,
    name:string,
    description:string,
    genres:Array<string>,
  }){
    let fileData = new FormData();
    if(data.file != undefined){
      fileData.append('photo',data.file,data.file.name);
    }
    fileData.append('name',data.name);
    fileData.append('description',data.description);
    for(let i = 0; i < data.genres.length; i++){
      fileData.append('genres[]',data.genres[i]);
    }
    return this.http.put(environment.server + '/api/film/' + data.id,fileData);
  }
  deleteFilm(id){
    return this.http.delete(environment.server + '/api/film/' + id);
  }
  getTopFilms(){
    return this.http.get(environment.server +'/api/film/top' );
  }
}
