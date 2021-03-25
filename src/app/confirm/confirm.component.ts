import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
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
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
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
export class ConfirmComponent implements OnInit {
  @Input() title:string;
  @Input() open:boolean;
  @Input() text:boolean;
  @Output() closeEv =  new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<boolean>();
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
    setTimeout(() => {
      this.closeEv.emit(true);
    }, 0);
  }
  confirm(){
    setTimeout(() => {
      this.confirmed.emit(true);
    }, 0);
    this.close();
  }
  ngOnInit(){
  }
}
