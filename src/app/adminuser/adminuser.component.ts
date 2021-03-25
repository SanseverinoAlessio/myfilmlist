import { Component, OnInit } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {UserService} from '../user.service';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation
} from '@angular/animations';
import {fadeIn,fadeOut} from '../tableChangeAnim';


@Component({
  selector: 'app-adminuser',
  templateUrl: './adminuser.component.html',
  styleUrls: ['./adminuser.component.css'],
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
export class AdminuserComponent implements OnInit {
  changeLoading = false;
  query = '';
  searchSubject = new Subject<string>();
  loading = false;
  length = 0;
  pageEvent:PageEvent;
  users:any = [];
  columndefs = ['id','name','email','admin','options'];
  constructor(private user:UserService) {
    this.searchSubject.pipe(
      debounceTime(500),
    ).subscribe((query)=>{
      this.query = query;
      if(this.query.length <= 0){
        this.users = [];
        this.getUsers({
          page: 1
        });
        return;
      }
      this.search();
    });
  }
  ngOnInit(): void {
    this.getUsers({
      page: 1
    });
  }
  changeSearch(query){
    this.searchSubject.next(query);
  }
  getUsers(data){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.user.getUsers({
      page:data.page,
      perpage: data.perpage
    }).subscribe((res:any)=>{
      this.loading = false;
      this.users = res;
      this.length = res.meta.totalItems;
    },err=>{
      this.loading = false;
    });
  }
  page(event:PageEvent){
    let page = event.pageIndex;
    page += 1;
    let perpage = event.pageSize;
    this.getUsers({
      page:page,
      perpage:perpage,
    });
  }
  deleteUser(id){
    if(this.changeLoading == true){
      return;
    }
    this.changeLoading = true;
    this.user.deleteUser(id).subscribe((res)=>{
      this.length -= 1;
      this.changeLoading = false;
      this.deleteFromArr(id);
    },err=>{
      this.changeLoading = false;
      console.log('errore!');
    });
  }
  deleteFromArr(id){
    this.users.result = this.users.result.filter((element)=>{
      return element._id != id ? element : null;
    });
    if(this.users.length <= 0){
      this.getUsers({
        page: 1
      });
    }
  }
  changeAdminValue(event:any,id){
    if(this.changeLoading == true){
    }
    this.changeLoading = true;
    let value = event.value;

    this.user.updateAdmin({
      id: id,
      value:value,
    }).subscribe((res)=>{
      this.changeLoading = false;
    },err=>{
      this.changeLoading = false;

      console.log('errore!');
    });
  }
  search(){
    if(this.loading == true){
      return;
    }
    this.users = [];
    this.loading = true;
    this.user.search(this.query).subscribe((res)=>{
      this.users.result = res;
      this.loading = false;
    },err=>{
      this.loading = false;
    });
  }
}
