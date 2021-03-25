import { Component, OnInit,HostListener } from '@angular/core';
import {AuthService} from '../auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {Router, NavigationEnd,NavigationError,NavigationCancel} from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {SettingsService} from '../settings.service';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations:[
    trigger('sidebar',[
      state('desktopSidebar',style({
        transform: "translateX(0px)",
        opacity:1,
        visibility: "visible",
      })),
      state('closed',style({
        transform: "translateX(-500px)",
        opacity: 0,
        visibility: "hidden",
      })),
      state('open', style({
        transform: "translateX(0px)",
        opacity: 1,
        visibility: "visible",
      })),
      transition("closed <=> open",[
        animate('0.5s ease-out')
      ]),
      transition("* <=> desktopSidebar",[
        animate('0s')
      ]),
    ]),
    trigger('mobileSearch',[
      state('open', style({
        opacity: 1,
        height: '60px',
        visibility: "visible",
      })),
      state('close',style({
        opacity: 0,
        height: '60px',
        visibility: 'hidden',
      })),
      state('desktopMode',style({
        opacity: 1,
        visibility: 'visible',
      })),
      transition('close <=> open',[
        animate('0.2s ease-out')
      ]),
    ]),
]
})
export class NavigationComponent implements OnInit {
  @HostListener('window:resize',["$event"])
  onresize(event){
    let width = event.target.innerWidth;
    if(width > 768){
      this.hamburgerMenuStatus = false;
      this.hamburgerDeactive = true;
    }
    else{
      this.deactive = '';
    }
  }
  accountLink:any = [];
  accountDropdown = false;
  searchInputChange = new Subject();
  subscription;
  deactive:any;
  hamburgerMenuStatus:boolean = false;
  hamburgerDeactive:boolean = false;
  logged:boolean;
  userInformation:any;
  avatarUrl:string = '../../assets/Images/default-avatar.png';
  mobileSearch:boolean = false;
  constructor(private auth:AuthService, public router:Router,private settings:SettingsService) {
    this.auth.loggedObservable.subscribe((res:any)=>{
      this.logged = res;
      this.isLogged();
    });
    this.searchInputChange.pipe(
      debounceTime(500),
    ).subscribe((value)=>{
      this.search(value);
    });
    this.settings.getInfo.subscribe((val)=>{
      this.isLogged();
    });
  }
  hamburgerMenuActive(){
    this.hamburgerMenuStatus = this.hamburgerMenuStatus == true ? false : true;
    this.deactive = this.hamburgerMenuStatus == true ? false : true;
  }
  ngOnInit(): void {
    this.isLogged();
    this.router.events.subscribe((e:any)=>{
      switch(true){
        case e instanceof NavigationError:
        case e instanceof NavigationCancel:
        case e instanceof NavigationEnd:{
          if(this.isMobile){
            setTimeout(() => {
              this.hamburgerMenuStatus = false;
            }, 300);
          }
          break;
        }
      }
    });
  }
  sidebarAnim(){
    if(window.innerWidth <= 768){
      return this.hamburgerMenuStatus == true ? 'open' : 'closed';
    }
    return 'desktopSidebar';
  }
  isMobile(){
    return window.innerWidth <= 768 ? true : false;
  }
  isLogged(){
    this.logged = this.auth.verifyToken() == true ? true : false;
    if(this.logged == false){
      this.avatarUrl ='../../assets/Images/default-avatar.png';
      return;
    }
    this.accountLink = [
      {
        name: 'Impostazioni',
        path:'/account/settings',
      },
      {
        name: "Esci",
        path:'/account/logout',
      }
    ];
    this.auth.getAccountInfo().subscribe((res)=>{
      this.userInformation = res;
      this.avatarUrl = this.userInformation.avatar.length > 0 ? environment.image + this.userInformation.avatar : '../../assets/Images/default-avatar.png';
      this.isAdmin();
    },(err)=>{
      console.log(err);
    });
  }
  isAdmin(){
    this.auth.isAdmin().subscribe((res)=>{
      this.accountLink.unshift({
        name:'Adminarea',
        path:'/admin',
      });
      return;
    },err=>{
      return;
    });
  }
  search(value){
    if(value.length <= 0){
      this.router.navigate(['/film']);
      return;
    }
    this.router.navigate(['/film/search', value]);
  }
  searchChange($event){
    let e:any = event;
    let value = e.target.value;
    this.searchInputChange.next(value);
  }
  searchAnimation(){
    if(this.hamburgerMenuStatus == true){
      this.mobileSearch = false;
    }
    if(!this.isMobile()){
      this.mobileSearch = false;
      return 'desktopMode';
    }
    return this.mobileSearch == true ? 'open' : 'close';
  }
}
