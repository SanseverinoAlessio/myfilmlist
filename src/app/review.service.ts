import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from  '@angular/common/http';
import {environment} from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(private http:HttpClient) { }
  addReview(data:{
    filmId: string,
    text: string,
  }) {
    let req = {text:data.text};
    return this.http.post(environment.server + '/api/review/' + data.filmId,req);
  }
  getReviews(data:{
    filmId:string,
    page: number,
    perPage?:number
  }){
    let perpage = data.perPage || 5;
    return this.http.get(environment.server + '/api/review/?filmid=' + data.filmId  + '&page=' + data.page + '&perpage=' + perpage);
  }
  getAllReviews(data:{
    page:number,
    perPage?: number
  }){
    let perpage = data.perPage || 10;
    return this.http.get(environment.server + '/api/review/?page=' + data.page + '&perpage=' + perpage);
  }
  getReview(filmId){
    return this.http.get(environment.server + '/api/review/single/' + filmId);
  }
  getUserReviews(data:{
    page:number,
    perPage?:number,
  }){
    let perpage = data.perPage || 10;
    return this.http.get(environment.server + '/api/review/userReview?page=' + data.page + '&perpage=' + perpage);
  }
  deleteUserReview(filmId){
    return this.http.delete(environment.server + '/api/review/userReview/' + filmId);
  }
  deleteReview(reviewId:string){
    return this.http.delete(environment.server + '/api/review/' + reviewId);
  }
  updateReview(data:{
    filmId:string,
    text:string,
  }){
    let req = {
      text: data.text,
    }
    return this.http.put(environment.server + '/api/review/' + data.filmId,req);
  }
  searchUserReviews(query){
    return this.http.get(environment.server + '/api/review/userReview/search/' + query);
  }
  searchReviews(query){
    return this.http.get(environment.server + '/api/review/search/' + query);
  }
  getReviewById(id){
    return this.http.get(environment.server + '/api/review/' + id);
  }

}
