import { Component, OnInit } from '@angular/core';
import {AdminReviewService} from '../admin-review.service';
import {ReviewService} from '../review.service';
import {environment} from '../../environments/environment';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-adminreviewview',
  templateUrl: './adminreviewview.component.html',
  styleUrls: ['./adminreviewview.component.css'],
  animations: [
    trigger('popUpAnim',[
      transition(':enter',[
        style({
          transform: 'scale(0,0)',
          opacity: 0,
          visibility: 'hidden',
        }),
        animate('0.4s ease-out',style({
          transform: 'scale(1,1)',
          opacity:1,
          visibility: 'visible',
        }))
      ]),
      transition(':leave',[
        style({
          transform: 'scale(1,1)',
          opacity:1,
          visibility: 'visible',
        }),
        animate('0.4s ease-out',style({
          transform: 'scale(0,0)',
          opacity: 0,
          visibility: 'hidden',
        }))
      ]),
    ]),
  ]
})
export class AdminreviewviewComponent implements OnInit {
  avatarPath = environment.image;
  reviewData;
  loading = false;
  id = '';
  status = false;
  constructor(private adminReview:AdminReviewService, private review:ReviewService) {
    this.adminReview.reviewViewOb.subscribe((data)=>{
      this.id = data.id;
      this.status = data.status;
      this.getReview()
    });
  }
  ngOnInit(): void {
  }
  getReview(){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.review.getReviewById(this.id).subscribe((res:any)=>{
      this.reviewData = res;
      this.loading = false;
    },err=>{
      this.loading = false;
    });
  }
  close(){
    this.status = false;

  }
}
