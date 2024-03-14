import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { io } from 'socket.io-client'

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket = io('http://localhost:3001')
  refreshPostId$ = new BehaviorSubject(null)
  refreshComments$ = new BehaviorSubject(null)
  constructor() {}

  sendRefreshPost(postId: number) {
    this.socket.emit('refreshPost', postId)
  }

  getRefreshPost() {
    this.socket.on('refreshPost', postId => {
      this.refreshPostId$.next(postId)
    })
  }

  sendRefreshComments(postId: number) {
    this.socket.emit('refreshComments', postId)
  }

  getRefreshComments() {
    this.socket.on('refreshComments', postId => {
      this.refreshComments$.next(postId)
    })
  }
}
