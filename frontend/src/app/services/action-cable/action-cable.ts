import { Injectable, NgZone } from '@angular/core'
import * as ActionCable from '@rails/actioncable'
import { ReplaySubject, Subject} from 'rxjs'
import { delay, filter, retryWhen } from 'rxjs/operators'
import { ActionCableBroadcaster } from './action-cable-broadcaster'

export type ChannelConnectionStatuses = 'connected' | 'rejected' | 'disconnected'

export interface SubscriptionInfo {
  subscription: ActionCable.Subscription
  broadcaster: ActionCableBroadcaster
  params: any
  channel: any
  status: ChannelConnectionStatuses
  actionCable: ActionCableService
  channelName: string
  ignoreOwnMessages?: boolean
}

interface disconnectEvent {
  key: string
  consumer: ActionCable.Consumer
}

export interface ActionCableData {
  type: string,
  data: any,
  client_trace_id: string
  message: string
}


export interface SubscriptionOptions {
  /** additional information sent the API when subscribing to a channel */
  params?: any

  /** For internal use only */
  originalSubscriptionInfo?: SubscriptionInfo,

  /** When set to true, will ignore messages with matching client-trace-id. In other words, websocket messages triggered by this client are ignored
   *  This can be overriden by each individual subscription
   */
  ignoreOwnMessages?: boolean
}

/** NEW WEBSOCKET SERVER */
@Injectable({ providedIn: 'root' })
export class ActionCableService {
  consumer: ActionCable.Consumer
  channels: Record<string, SubscriptionInfo> = {}

  connectionTicket: string = 'no_ticket'

  readonly RECONNECT_POLLING = 5000 // milliseconds

  private _connected = false
  connected$ = new ReplaySubject<boolean>(1)
  set connected(value: boolean) {
    this._connected = value
    this.connected$.next(value)
  }
  get connected() {
    return this._connected
  }
  onConnect$ = this.connected$.pipe(filter(connected => Boolean(connected)))

  reconnectRequest$ = new Subject<disconnectEvent>()

  constructor(private ngZone: NgZone) {

    // TODO: remove this workaround -> createWebSocketURL is undefined exception
    // in action_cable.js
    let w: any = window
    w.createWebSocketURL = ActionCable.createWebSocketURL 

    this.reconnectRequest$
      .pipe(
        retryWhen(errors => errors.pipe(delay(5000)))
      )
      .subscribe(ticket => {
        if (this.consumer.connection.isActive()) {
          const disconnectedChannels = Object.values(this.channels).filter(channel => channel.status !== 'connected')

          if (disconnectedChannels.length) {
            this.log('[websockets] Re-subscribing to non connected channels only...')

            disconnectedChannels.forEach(channel => {
              this.subscribe(channel.channel, {
                params: channel.params,
                ignoreOwnMessages: channel.ignoreOwnMessages,
                originalSubscriptionInfo: channel
              })
            })
          }
        } else {
          this.log('[websockets] Re-subscribing to all channels...')

          Object.entries(this.channels).forEach(([, channel]) => {
            channel.subscription.unsubscribe()
          })

          this.consumer.disconnect()
          this.consumer.connect()

          Object.entries(this.channels).forEach(([, channel]) => {
            this.log(`[websockets] reconnecting to: ${channel.channelName}...`)

            this.subscribe(channel.channel, {
              params: channel.params,
              ignoreOwnMessages: channel.ignoreOwnMessages,
              originalSubscriptionInfo: channel
            })
          })
        }
      })
  }

  subscribe(channel: any, options?: SubscriptionOptions): ActionCableBroadcaster {
    let channelName = this.getChannelName(channel, options?.params)
    let broadcaster = options?.originalSubscriptionInfo?.broadcaster ?? new ActionCableBroadcaster()
    let subscriptionInfo: SubscriptionInfo = {
      params: options?.params,
      subscription: null,
      broadcaster: broadcaster,
      channel: channel,
      status: null,
      actionCable: this,
      channelName: channelName,
      ignoreOwnMessages: options?.ignoreOwnMessages,
    }

    let subscriptionParams = Object.assign(
      {
        channel: channel,
      },
      options?.params,
    )

    let subscription = this.consumer.subscriptions.create(subscriptionParams, {
      received: (data: ActionCableData) => {
        if (data.type === 'unauthorized') {
          this.log(`[websockets] unauthorized for: ${channelName}`)

          subscription.unsubscribe()
          delete this.channels[channelName]
        } else if(data.type === 'subscription_attempt_failed') {
          this.log(`[websockets] subscription attempt failed for: ${channelName} due to ${data.message}`)

          subscription.unsubscribe()
          delete this.channels[channelName]
        } else {
          this.log(`[websockets] recieved data for:  ${channelName}`, data)

          broadcaster.broadcast(data)
        }
      },
      connected: () => {
        this.log(`[websockets] successfully connected to: ${channelName}`)

        subscriptionInfo.status = 'connected'
        broadcaster.status = subscriptionInfo.status

        options?.originalSubscriptionInfo?.broadcaster?.reConnected()
      },
      rejected: () => {
        this.log(`[websockets] rejected from: ${channelName}`)

        subscriptionInfo.status = 'rejected'
        broadcaster.status = subscriptionInfo.status

        subscription.unsubscribe()
      },
      disconnected: () => {
        this.log(`[websockets] disconnected from: ${channelName}`)

        subscriptionInfo.status = 'disconnected'
        broadcaster.status = subscriptionInfo.status

        subscription.unsubscribe()
      },
    })

    // unsub from old subscription
    broadcaster.subscriptionInfo?.subscription?.unsubscribe()

    // add new subscription
    subscriptionInfo.subscription = subscription

    // set new subInfo to broadcaster
    broadcaster.subscriptionInfo = subscriptionInfo

    this.channels[channelName] = subscriptionInfo

    return broadcaster
  }

  log(...param) {  
    console.log(...param)
  }

  unsubscribe(channel: string, params?): void {
    let channelName = this.getChannelName(channel, params)
    const subscription = this.channels[channelName]?.subscription

    if (!subscription) {
      this.log(`[websockets] No Subscription for Channel ${channelName} found!`)
    } else {
      this.log(`[websockets] successfully unsubscribed from ${channelName}`)

      subscription.unsubscribe()
    }

    delete this.channels[channelName]
  }

  perform(channel: string, params, action: string, data: any): void {
    let channelName = this.getChannelName(channel, params)
    this.channels[channelName].subscription.perform(action, data)
  }

  /** A one-time-use ticket is required to successfully initialize a websocket connection. This ticket is retrieved from the API */
  connect(url, ticket?: string): ActionCable.Consumer {
    this.connectionTicket = ticket

    const urlCallback: unknown = () => `${url}?ticket=${this.connectionTicket}`

    this.consumer = ActionCable.createConsumer(urlCallback as string)

    this.consumer.connect()

    this.startConnectionMonitoring()

    this.connected = true

    return this.consumer
  }

  startConnectionMonitoring() {
    // ngZone is used to avoid unnecessary change detection triggered by setInterval
    this.ngZone.runOutsideAngular(() => {
      // polls every 5 seconds to check if the connection is active. if not it will emit a reconnectRequest
      setInterval(() => {
        // The reconnect request will only reconnect to channels that were disconnected so we can spam this without issues
        if(!this.consumer.connection.isActive()){
          this.reconnectRequest$.next({ key: this.connectionTicket, consumer: this.consumer})
        }
      }, this.RECONNECT_POLLING)
    })
  }

  disconnect(): void {
    this.consumer?.disconnect()
  }

  private getChannelName(channel: any, params?): string {
    let channelName: string = ''

    if (typeof channel === 'object') {
      channelName = channel.channel
    } else if (typeof channel === 'string') {
      channelName = channel
    }

    if (params != null) {
      channelName = `${channelName}_${JSON.stringify(params)}`
    }

    return channelName
  }
}
