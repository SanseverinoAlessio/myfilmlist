import { Component, OnInit } from '@angular/core';
import {ReviewService} from '../review.service';
import {environment} from '../../environments/environment';
import {Router,ActivatedRoute} from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { FormControl,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-review-page',
  templateUrl: './user-review-page.component.html',
  styleUrls: ['./user-review-page.component.css']
})
export class UserReviewPageComponent implements OnInit {
  notFound = false
  reviews = [];
  loading:boolean = false;
  avatarUrl = environment.image;
  currentReview:string = '';
  query = '';
  constructor(private review:ReviewService,private router:Router,private route:ActivatedRoute) {
    this.route.params.subscribe((param)=>{
      if(param.query == undefined){
        return;
      }
      this.query = param.query;
      this.searchReviewsByQuery();
    });
  }
  ngOnInit(): void {
    this.getReviews(1);
  }
  getReviews(page){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.review.getUserReviews({
      page: page,
    }).subscribe((res:any)=>{
      this.reviews = this.reviews.concat(res);
      this.loading = false;
    },err=>{
      this.loading = false;
      console.log('errore!');
    });
  }
  changeReview(reviewtext,filmid,loading){
    let loadingSpinner = loading._elementRef.nativeElement;
    if(loadingSpinner.style.display == 'block' || reviewtext.length < 50 || reviewtext.length > 400 ){
      return;
    }
    let data = {
      filmId: filmid,
      text: reviewtext
    }
    loadingSpinner.style.display = 'block';
    this.review.updateReview(data).subscribe((res)=>{
      loadingSpinner.style.display = 'none';
      this.currentReview = '';
      this.changeInArr(filmid,reviewtext);
    },err=>{
      console.log('errore!');
    });
  }
  cancel(filmid,input){
    this.currentReview = '';
    this.reviews.map((elem)=>{
      if(elem.film[0]._id == filmid){
        input.value = elem.text;
      }
    });
  }
  deleteReview(filmId,loading){
    let loadingSpinner = loading._elementRef.nativeElement;
    if(loadingSpinner.style.display == 'block'){
      return;
    }
    this.deleteFromArr(filmId);
    loadingSpinner.style.display = 'block';
    this.review.deleteUserReview(filmId).subscribe((res)=>{
      loadingSpinner.style.display = 'none';
      this.deleteFromArr(filmId);
    },err=>{
      console.log('errore!');
    });
  }
  deleteFromArr(filmId){
    this.reviews = this.reviews.filter((elem)=>{
      return elem.film[0]._id != filmId ? elem : null;
    });
  }
  changeInArr(filmId,text){
    this.reviews.map((elem,index)=>{
      if(elem.film[0]._id == filmId){
        this.reviews[index].text =text;
      }
    });
  }
  onScroll(){
    if(this.query.length > 0){
      return;
    }
    let page = Math.ceil(this.reviews.length / 10) + 1;
    this.getReviews(page);
  }
  searchReviewsByQuery(){
    this.reviews = [];
    if(this.loading == true){
      return;
    }
    this.notFound = false;
    this.loading = true;
    this.review.searchUserReviews(this.query).subscribe((res:any)=>{
      this.loading = false;
      this.reviews = res;
      if(this.reviews.length <= 0){
        this.notFound = true;
      }
    }, err=>{
      this.loading = false
      console.log('errore!');
    });
  }
}
