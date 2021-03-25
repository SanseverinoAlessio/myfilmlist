import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {OnInit} from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'filmApp';
  constructor(private router:Router){
  }
  ngOnInit(){
    this.router.events.subscribe((e)=>{
      if(!(e instanceof NavigationEnd)){
        return
      }
      window.scrollTo(0,0);
    });
  }
}
