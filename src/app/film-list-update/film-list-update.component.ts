import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {ListService} from '../list.service';
@Component({
  selector: 'app-film-list-update',
  templateUrl: './film-list-update.component.html',
  styleUrls: ['./film-list-update.component.css'],
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
export class FilmListUpdateComponent implements OnInit {
  currentId;

  open=  false;
  states = ['Visto','Da vedere','Incompleto'];
  updateForm = new FormGroup({
    state: new FormControl('',[
      Validators.required,
    ]),
    vote: new FormControl('',[
      Validators.required,
    ])
  })
  constructor(private list:ListService) {
  }
  close(){
    this.open = false;
  }
  ngOnInit(){
    this.list.openUpdateListOb.subscribe((data:any)=>{
      this.open = data.open;
      this.currentId = data.id;
      this.updateForm.get('vote').setValue(data.vote);
      this.updateForm.get('state').setValue(data.state);
    });
  }
  update(){
    let data = {
      state: this.updateForm.value.state,
      vote: this.updateForm.value.vote,
      filmId: this.currentId,
    }
    this.list.updateFilm(data).subscribe((res)=>{
      this.passValues();
      this.close();
    },err=>{
      console.log('errore!');
    });
  }
  passValues(){
    this.list.updateFilmVal({
      state: this.updateForm.value.state,
      vote: this.updateForm.value.vote,
      filmId: this.currentId
    });
  }
}
