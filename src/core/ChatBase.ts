import EventMap from "../types/EventMap"
import { Subject, Subscription } from 'rxjs'
import Event from "../types/Event"

type SubscriptionStore = {
  [key: string]: Subscription[]
}

type EventStore = {
  [key in keyof EventMap]?: {
    subject: Subject<any>
    callback: Event
  }
}

export default abstract class ChatBase<ChatApi> {
  abstract _loader(): Promise<ChatApi>
  
  abstract _eventMap: EventMap
  
  protected _api: ChatApi | undefined
  
  private _subscriptions: SubscriptionStore = {}
  private _events: EventStore = {}
  private _eventsMapped: boolean = false
  
  constructor() {
    this.init()
  }
  
  private async init(): Promise<ChatApi> {
    this._api = await this._loader()
    this.mapEvents()
    return this._api
  }
  
  public on(eventString: string, callback: Event): void {
    const namespaces = eventString.split('.')
    const eventName = namespaces[0]
    
    // @ts-ignore
    const event = this._events[eventName]
    if (!event) throw ChatBase.setError(`Event ${eventName} is not mapped`)
    const subscription = event.subject.subscribe({
      next(data: any) {
        callback(data)
      }
    })
    this.storeSubscription(namespaces, subscription)
  }
  
  public off(eventString: string): void {
    const namespaces = eventString.split('.')
    
    for (const namespace of namespaces) {
      const subscriptions = this._subscriptions[namespace]
      if (subscriptions) {
        for (const subscription of subscriptions) {
          subscription.unsubscribe()
        }
      }
    }
    
  }
  
  public hasEvent(eventName: keyof EventMap): boolean {
    return Boolean(this._events[eventName])
  }
  
  private storeSubscription(namespaces: string[], subscription: Subscription): void {
    for (const namespace of namespaces) {
      this._subscriptions[namespace] = this._subscriptions[namespace] || []
      this._subscriptions[namespace].push(subscription)
    }
  }
  
  protected mapEvents(): void {
    if (!this._eventsMapped) return
    if (!(this._api instanceof Object)) throw ChatBase.setError('Chat API not referenced to "this._api" yet')
    
    for (const prop of Object.keys(this._eventMap) as Array<keyof EventMap>) {
      const callbackTuple = this._eventMap[prop]
      if (callbackTuple) {
        const chatCallbackName = callbackTuple[0]
        const callback = callbackTuple[1]
        this._events[prop] = {
          subject: new Subject(),
          callback
        }
        try {
          this.attachEvent(chatCallbackName, (...args) => {
            const event = this._events[prop]
            if (event) {
              event.subject.next(event.callback(...args))
            }
          })
        } catch (e) {
          throw ChatBase.setError('Error setting callbacks in Chat API', e)
        }
      }
    }
    
    this._eventsMapped = true
  }
  
  protected attachEvent(event: string, callback: Event<any>): void {
    // @ts-ignore
    this._api[event] = callback
  }
  
  protected static setError(message: string, error?: Error): Error {
    if (error) message += ` -> ${error.message}`
    return new Error(message)
  }
  
}
