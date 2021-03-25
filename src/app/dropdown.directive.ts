import { Directive,HostListener,Input,OnChanges,ElementRef,OnInit  } from '@angular/core';
@Directive({
  selector: '[mobileDropdown]'
})
export class DropdownDirective implements OnInit,OnChanges{
  @Input() close:any;
  @HostListener('click',["$event"])
  onclick(event){
    let target = event.currentTarget;
    this.changeState(target);
  }
  constructor(private elem:ElementRef) {
  }
  ngOnInit(){
  }
  ngOnChanges(){
    if(this.close == true){
      console.log('cambiaa');
      this.changeState(this.elem.nativeElement,true);
    }
  }
  changeState(target,forceClose:boolean = false){
    if(forceClose == true){
      target.classList.remove('active');
      return;
    }
    target.classList.toggle('active');

    //  let children = target.children
    /*for(let child of children){
    if(child.tagName.toLowerCase() == "ul"){
    if(forceClose == true){
    child.classList.remove('active');
    return;
  }
  child.classList.toggle('active');
} */
}
}
