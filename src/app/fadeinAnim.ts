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
        transform: "translateY({{translateYBefore}})",
      }),
      animate('1s ease-out',style({
        opacity: 1,
        transform: "translateY({{translateYAfter}})",
      })),
])
