import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { io } from 'socket.io-client'

// @Injectable({
//   providedIn: 'root',
// })
// export class WebsocketService {
//   socket = io('http://localhost:3001')
//   refreshPostId$ = new BehaviorSubject(null)
//   refreshAllComments$ = new BehaviorSubject(null)
//   refreshComment$ = new BehaviorSubject(null)

//   constructor() {}

//   sendRefreshPost(postId: number) {
//     this.socket.emit('refreshPost', postId)
//   }

//   getRefreshPost() {
//     this.socket.on('refreshPost', postId => {
//       this.refreshPostId$.next(postId)
//     })
//   }

//   sendRefreshAllComments(postId: number) {
//     this.socket.emit('refreshComments', postId)
//   }

//   getRefreshAllComments() {
//     this.socket.on('refreshComments', postId => {
//       this.refreshAllComments$.next(postId)
//     })
//   }

//   sendRefreshComment(commentId: number) {
//     this.socket.emit('refreshComment', commentId)
//   }

//   getRefreshComment(): Observable<any> {
//     return new Observable(subscriber => {
//       this.socket.on('refreshComment', commentId => {
//         subscriber.next(commentId)
//         this.refreshComment$.next(commentId)
//       })
//     })
//   }
// }
