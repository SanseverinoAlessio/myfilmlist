import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {Router} from '@angular/router';
@Component({
  selector: 'app-user-reviews-header',
  templateUrl: './user-reviews-header.component.html',
  styleUrls: ['./user-reviews-header.component.css']
})
export class UserReviewsHeaderComponent implements OnInit {
  searchChange = new Subject<string>();
  constructor(private router:Router) {
    this.searchChange.pipe(
      debounceTime(400),
    ).subscribe((val)=>{
      if(val.length <= 0){
        this.router.navigate(['/account/reviews']);
        return;
      }
      this.search(val);
    });
  }
  ngOnInit(): void {
  }
  inputChange($event){
    let e:any = event;
    let value = e.target.value;
    this.searchChange.next(value);
  }
  search(val){
   this.router.navigate(['/account/reviews/search',val]);
  }
}
