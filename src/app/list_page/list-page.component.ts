import { Component, OnInit } from '@angular/core';
import {ListService} from '../list.service';
import {environment} from '../../environments/environment';
import {fadeIn} from '../fadeinAnim';
import {deleteAnim} from '../deleteAnim';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  useAnimation
} from '@angular/animations';
@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css'],
  animations: [trigger('fadeIn',[
    transition(':enter',[
      useAnimation(fadeIn,{
        params:{
          translateYBefore: 0,
          translateYAfter: 0,
        }
      })
    ]),
    state('delete',style({
      transform: "scale(0)",
      opacity: 0,
    })),
    transition('* => delete',[
      animate('0.3s'),
    ]),
  ]),
]
})
export class ListPageComponent implements OnInit {
  notFound = false;
  query = '';
  loading = false;
  films:any = [];
  imagesPath = environment.image;
  url = this.router.url;
  state = '';
  translatedState;
  constructor(private list:ListService,private router:Router,private route:ActivatedRoute) {
    let urlMatch = this.url.match('watched|planned|incompleted');
    if(urlMatch != null){
      this.state = urlMatch[0];
      this.translatedState = (()=>{
        switch (this.state) {
          case 'watched':
          return 'Visto';
          break;
          case 'planned':
          return 'Da vedere';
          break;
          case 'incompleted':
          return 'Incompleto';
          break;
        }
      })();
    }
    this.list.updateFilmOb.subscribe((val:any)=>{
      if(val.state != this.translatedState && this.query.length < 0){
        this.removeFromArr(val.filmId);
        return;
      }
      this.updateInArr({
        filmId: val.filmId,
        vote: val.state != 'Da vedere' ? val.vote : null,
        state: val.state
      });
    });
    this.route.params.subscribe((param)=>{
      if(Object.keys(param).length <= 0){
        return;
      }
      this.films = [];
      this.query = param.query;
      this.search();
    });
  }
  ngOnInit(): void {
    this.getFilms(1);
  }
  getFilms(page){
    if(this.loading == true){
      return;
    }
    this.loading = true;
    this.list.getList({
      state: this.translatedState,
      page: page,
    }).subscribe((res)=>{
      this.loading = false;
      this.films = this.films.concat(res);
    },err=>{
      this.loading = false;
    });
  }
  removeFilm(element){
    element.delete = true;
    let id = element.film._id;
    setTimeout(() => {
      this.list.removeFilm(id).subscribe((res:any)=>{
        if(res.deleted == true){
          this.removeFromArr(id);
        }
      },err=>{
        console.log(err);
      });
    }, 300);
  }
  updateInArr(data){
    this.films.map((element,index)=>{
      if(element.film._id == data.filmId){
        this.films[index].vote = data.vote;
        if(this.films[index].state != data.state && this.query.length <= 0){
          this.removeFromArr(element.film._id);
        }
        this.films[index].state = data.state;
      }
    });
  }
  removeFromArr(id){
    this.films =  this.films.filter((elem)=>{
      return elem.film._id != id ? true : false;
    });
  }
  openUpdateForm(id,vote,state){
    this.list.openUpdatePage({
      open: true,
      id: id,
      state:state,
      vote:vote,
    });
  }
  onScroll(){
    let page = Math.ceil(this.films.length / 10) + 1;
    this.getFilms(page);
  }
  search(){
    if(this.loading == true){
      return;
    }
    this.notFound = false;
    this.loading = true;
    this.list.search(this.query).subscribe((res:any)=>{
      this.loading = false;
      this.films = res;
      if(this.films.length <= 0){
        this.notFound = true;
      }
      this.films.map((element,index)=>{
        this.films[index].film = element.film[0];
      });
    },err=>{
      this.loading = false;
      console.log('errore!');
    });
  }
}
