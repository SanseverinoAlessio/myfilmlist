import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {ListService} from '../list.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-list-nav',
  templateUrl: './list-nav.component.html',
  styleUrls: ['./list-nav.component.css']
})
export class ListNavComponent implements OnInit {
  searchChangeOb = new Subject();
  constructor(private list:ListService, private router:Router) {
    this.searchChangeOb.pipe(
      debounceTime(500),
    ).subscribe((value)=>{
       this.search(value);
    });
  }
  ngOnInit(): void {
  }
  searchChange($event){
    let e:any = event;
    let value = e.target.value;
    this.searchChangeOb.next(value);
  }
  search(value){
   if(value.length <= 0){
     return;
   }
   this.router.navigate(['/account/list/search/',value]);
  }
}
