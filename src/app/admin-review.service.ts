import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminReviewService {
  reviewView = new Subject<any>();
  reviewViewOb = this.reviewView.asObservable();
  constructor() { }
  
  passNewValues(data:{
    status:boolean,
    id: string,
  }){
    this.reviewView.next(data);
  }
}
