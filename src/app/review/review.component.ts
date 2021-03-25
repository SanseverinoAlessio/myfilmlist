import { Component, OnInit,Input } from '@angular/core';
import {ReviewService} from '../review.service';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() logged:boolean;
  @Input() filmId:string;
  @Input() existInList:boolean
  userReviewExist = false;
  createReview:boolean = false;
  reviews:any =[];
  loadingReviews = false;
  lastReview = false;
  lastIndex = 0;
  loadingAddReview:boolean = false;
  reviewForm = new FormGroup({
    text: new FormControl('',[
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(400),
    ]),
  });
  avatarUrl = environment.image;
  constructor(private review:ReviewService) {
  }
  ngOnInit(): void {
    this.getReviews(1);
    this.currentUserReviewExist();
  }
  getReviews(page){
    this.loadingReviews = true;
    this.review.getReviews({
      filmId: this.filmId,
      page: page,
    }).subscribe((res:any)=>{
      this.loadingReviews = false;
      if(res.result.length <= 0){
        this.lastReview = true;
        return;
      }
      if(this.reviews.length <= 0){
        this.reviews = res;
        return;
      }
      this.reviews.result = this.reviews.result.concat(res.result);
      return;
    }, err=>{
      console.log(err);
      return;
    });
  }
  addReview(){
    this.loadingAddReview = true;
    let data = {
      filmId: this.filmId,
      text: this.reviewForm.value.text,
    }
    this.review.addReview(data).subscribe((res:any)=>{
      if(this.reviews.result == undefined){
        this.reviews.result = [];
      }
      this.reviews.result.push(res.result);
      this.loadingAddReview = false;
      this.userReviewExist = true;
    },err=>{
      this.loadingAddReview = false;
      console.log(err);
    });
  }
  loadOtherReviews(){
    let page = Math.ceil(this.reviews.result.length/5) +1;
    this.getReviews(page);
  }
  currentUserReviewExist(){
    this.review.getReview(this.filmId).subscribe((res:any)=>{
      if(Object.keys(res).length <= 0){
        this.userReviewExist = false;
        return;
      }
      this.userReviewExist = true;
      return;
    },err=>{
      this.userReviewExist = false;
      return;
    });
  }
}
