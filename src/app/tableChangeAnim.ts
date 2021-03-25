import {
  trigger,
  state,
  style,
  animate,
  transition,
    animation
} from '@angular/animations';
export const fadeIn = animation([
      style({
        opacity:0,
        visibility: 'hidden'
      }),
      animate('0.5s ease-out',style({
        opacity: 1,
        visibility: "visible"
      })),
])
export const fadeOut = animation([
      style({
        opacity:1,
        visibility: 'visible'
      }),
      animate('0.5s ease-out',style({
        opacity: 0,
        visibility: "hidden"
      })),
])
