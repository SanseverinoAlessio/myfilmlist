import { Component, OnInit } from '@angular/core';
import {ReviewService} from '../review.service';
import {PageEvent} from '@angular/material/paginator';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {fadeIn,fadeOut} from '../tableChangeAnim';
import {AdminReviewService} from '../admin-review.service';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation
} from '@angular/animations';
@Component({
  selector: 'app-adminreviewpage',
  templateUrl: './adminreviewpage.component.html',
  styleUrls: ['./adminreviewpage.component.css'],
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
export class AdminreviewpageComponent implements OnInit {
  query = '';
  searchSubject = new Subject<string>();
  pageEvent:PageEvent;
  changeLoading = false;
  length = 0;
  columndefs = ['id','userid','username','filmname','options'];
  reviews:any = [];
  loading = false;
  constructor(private review:ReviewService,private adminReview:AdminReviewService) {
    this.searchSubject.pipe(
      debounceTime(500),
    ).subscribe((query)=>{
      this.reviews = [];
      this.query = query;
      if(this.query.length <= 0){
        this.getReviews({
          page: 1,
        });
        return;
      }
      this.search();
    });
  }
  ngOnInit(): void {
    this.getReviews({
      page: 1,
    });
  }
  getReviews(data){
    if(this.loading == true){
      this.loading = false;
    }
    this.loading = true;
    this.review.getAllReviews({
      page: data.page,
      perPage: data.perPage,
    }).subscribe((res:any)=>{
      this.loading = false;
      this.length = res.meta.totalItems;
      this.reviews = res;
    },err=>{
      this.loading = false;
    });
  }
  changeSearch(value){
    this.searchSubject.next(value);
  }
  search(){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.review.searchReviews(this.query).subscribe((res)=>{
      this.reviews.result = res;
      this.loading = false;
    },err=>{
      this.loading = false;
    });
  }
  deleteReview(id){
    if(this.changeLoading == true){
      return;
    }
    this.changeLoading = true;
    this.review.deleteReview(id).subscribe((res)=>{
      this.length -= 1;
      this.changeLoading = false;
      this.deleteFromArr(id);
    },err=>{
      this.changeLoading = false;
    });
  }
  deleteFromArr(id){
    this.reviews.result = this.reviews.result.filter((elem)=>{
      return elem._id != id ? elem : null;
    });
    if(this.reviews.result.length <= 0){
      this.getReviews({
        page: 1,
      });
    }
  }
  page(event:PageEvent){
    let page = event.pageIndex;
    page += 1;
    let perpage = event.pageSize;
    this.getReviews({
      page: page,
      perPage: perpage,
    });
  }
  viewReview(id){
    this.adminReview.passNewValues({
      id:id,
      status: true,
    });
  }



}
