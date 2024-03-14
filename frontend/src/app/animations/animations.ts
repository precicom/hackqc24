import { animate, keyframes, query, stagger, style, transition, trigger } from "@angular/animations"

export const fadeIn = trigger('fadeIn', [
    transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s', style({ opacity: 1 })),
  ]),
])

export const fadeOut = trigger('fadeOut', [
  transition(':leave', [
    animate('0.5s', style({ opacity: 0 })),
  ]),
])

export const slideInOut =  trigger('slideInOut', [
  transition(':enter', [
    style({marginTop: '-50%', opacity: 0}),
    animate('800ms ease-in-out', style({marginTop: '0px', opacity: 1}))
  ])
]) 

// Create an animation that makes an element appear slightly above its final position and fades in as it moves down to its final position.
export const slideAndFadeIn = trigger('slideAndFadeIn', [
  transition(':enter', [
    animate('500ms', keyframes([
      style({ opacity: 0, transform: 'translateY(-20px)', offset: 0 }),
      style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
    ]))
  ])
]);

// Create an Angular2 animation that animates the appearence of list items one after the other in sequence. Each element is appearing slightly after the last one
export const staggeredFadeIn = trigger('staggeredFadeIn', [
  transition(':enter', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      stagger('50ms', [
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ])
]);


