import { map, filter, debounceTime } from 'rxjs/operators'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { ActionCableData, ChannelConnectionStatuses, SubscriptionInfo } from './action-cable'
// import { AuthInterceptor } from '../auth-interceptor'

export interface BroadcastingOptions {
  ignoreOwnMessages?: boolean
}

export class ActionCableBroadcaster {
  private _eventBus = new Subject<ActionCableData>()
  private _onReconnect = new Subject<any>()
  subscriptionInfo: SubscriptionInfo

  ignoreOwnMessages = false

  // Status
  private _state: ChannelConnectionStatuses = 'disconnected'
  state$ = new BehaviorSubject<ChannelConnectionStatuses>(this._state)
  set status(state: ChannelConnectionStatuses) {
    if(this._state !== state){
      this._state = state
      this.state$.next(state)
    }
  }
  get status(){
    return this._state
  }

  isConnected$ = this.state$.pipe(map(state => state === 'connected'))

  broadcast(data: any) {
    this._eventBus.next(data)
  }

  reConnected(data?: any) {
    this._onReconnect.next(data)
  }

  on<T>(key: string | ((data: any) => boolean), options?: BroadcastingOptions): Observable<T> {
    return this._eventBus.asObservable().pipe(
      filter(event => {
        const ignoreOwnMessage = options?.ignoreOwnMessages ?? this.subscriptionInfo.ignoreOwnMessages

        return true
        // if(ignoreOwnMessage && AuthInterceptor.client_id === event.client_trace_id){
        //   return false
        // }else {
        //   return true
        // }
      }),
      filter(event => {
        if (typeof key === 'string') {
          return event.type == key
        } else if (typeof key === 'function') {
          return key(event)
        } else {
          return false
        }
      }),
      map(event => {
        return event as T
      }),
    )
  }

  /** If a reconnect has occured, it may mean that the client was offline for a long period of time
   *
   *  Consider reloading data if a reconnect has occured to ensure client is up to date
   */
  onReconnect() {
    return this._onReconnect.asObservable().pipe(debounceTime(1000))
  }

  unsubscribe() {
    this.subscriptionInfo.actionCable.unsubscribe(this.subscriptionInfo.channel, this.subscriptionInfo.params)
  }

  perform(serverMethod: string, params: any){
    this.subscriptionInfo.subscription.perform(serverMethod, params)
  }
}
