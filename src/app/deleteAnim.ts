import {
  trigger,
  state,
  style,
  animate,
  transition,
    animation
} from '@angular/animations';
export const deleteAnim = animation([
      style({
        opacity: 1,
        transform: "scale(1,1)",
      }),
      animate('0.5s ease-out',style({
        opacity: 0,
        transform: "scale(0,0)",
      })),
])
