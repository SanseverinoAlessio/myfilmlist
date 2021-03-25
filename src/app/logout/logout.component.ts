import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(private auth:AuthService,private router:Router,private location:Location) { }
  ngOnInit(): void {
    this.auth.logout();
    this.auth.changeLoggedState(false);
    this.location.back();
  }

}
