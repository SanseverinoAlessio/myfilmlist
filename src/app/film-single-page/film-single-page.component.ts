import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FilmService} from '../film.service';
import {environment} from '../../environments/environment';
import {ListService} from '../list.service';
import {AuthService} from '../auth.service';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
@Component({
  selector: 'app-film-single-page',
  templateUrl: './film-single-page.component.html',
  styleUrls: ['./film-single-page.component.css']
})
export class FilmSinglePageComponent implements OnInit {
  showVoteInput = true;
  loadingFilm = false;
  completed:boolean = false;
  states = ['Visto',"Da vedere","Incompleto"];
  addingFilm:boolean = false;
  lastReview:boolean = false;
  loadingReviews:boolean = false;
  logged:boolean;
  existInList = false;
  currentSection:string = 'review';
  imagesPath = environment.image;
  filmId;
  filmData;
  lastIndex:number = 0;
  reviews = [];
  addForm = new FormGroup({
    state: new FormControl('',[
      Validators.required,
    ]),
    vote: new FormControl('',[
      Validators.required,
    ]),
  });
  constructor(private router:Router,private route:ActivatedRoute, private film:FilmService,
    private list:ListService, private auth:AuthService,private _location:Location) {
      this.addForm.get('state').valueChanges.subscribe((res)=>{
        if(res == 'Da vedere'){
          this.showVoteInput = false;
          this.addForm.get('vote').clearValidators();
          this.addForm.get('vote').updateValueAndValidity();
        }
        else{
          this.showVoteInput = true;
          this.addForm.get('vote').setValidators([Validators.required]);
          this.addForm.get('vote').updateValueAndValidity();
        }
      });
    }
    ngOnInit(): void {
      this.logged = this.auth.verifyToken();
      this.filmId = this.route.snapshot.params['filmId'];
      this.getFilm();
    }
    getFilm(){
      if(this.loadingFilm == true){
        return;
      }
      this.loadingFilm = true;
      this.film.getFilm(this.filmId).subscribe((res)=>{
        console.log(res);
        this.loadingFilm = false;
        this.filmData = res;
        this.checkFilmInList();
      },err=>{
        console.log('errore!');
        this.router.navigate(['/404']);
      });
    }
    checkFilmInList(){
      if(this.logged == false){
        return;
      }
      this.list.getFilm(this.filmId).subscribe((res:any)=>{
        if(res.film == undefined){
          return;
        }
        this.existInList = true;
      },err=>{
        return;
      });
    }
    back(){
      this._location.back();
    }
    formIsValid(){
      return this.addForm.valid == true ? true : false;
    }
    addInList(){
      if(this.formIsValid() == false || this.completed == true || this.addingFilm == true){
        return;
      }
      this.addingFilm = true;
      let data = {
        filmId: this.filmId,
        state: this.addForm.value.state,
        vote: this.addForm.value.vote,
      }
      this.list.addFilm(data).subscribe((res:any)=>{
        this.addingFilm = false;
        if(res.added != undefined && res.added == true){
          this.completed = true;
          this.existInList = true;
          this.filmData.vote = res.newAverageVote;
        }
      },err=>{
        this.addingFilm = false;
        console.log(err);
      });
    }
  }
