import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from  '@angular/common/http';
import {environment} from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GenreService {
  constructor(private http:HttpClient) { }
  getAll(){
    return this.http.get(environment.server + '/api/genre/?all=true');
  }
  getForGenreTable(data:{
    page:number,
    perpage?:number
  }){
    let perpage = data.perpage ?? 10;
    return this.http.get(environment.server + '/api/genre/?page=' + data.page + '&perpage=' + perpage);
  }
  createGenre(data:{
    name:string,
    file:any
  }){
    let fileData = new FormData();
    fileData.append('photo',data.file,data.file.name);
    fileData.append('name', data.name);
    return this.http.post(environment.server + '/api/genre',fileData);
  }
  updateGenre(data:{
    id:string
    name: string,
    file?:any
  }){
    console.log(data.file);
    let fileData = new FormData;
    fileData.append('name', data.name);
    if(data.file != undefined){
      fileData.append('photo', data.file, data.file.name);
    }
    return this.http.put(environment.server + '/api/genre/' + data.id ,fileData);
  }
  searchByName(query){
    return this.http.get(environment.server + '/api/genre/search/' + query);
  }
  delete(id:String){
    return this.http.delete(environment.server + '/api/genre/' + id);
  }
  getById(id:string){
    return this.http.get(environment.server + '/api/genre/single/' + id);
  }
}
