import EventMap from "../types/EventMap"
import { Subject, Subscription } from 'rxjs'
import EventCallback from "../types/EventCallback"

type SubscriptionStore = {
  [key: string]: Subscription[]
}

type Event = {
  subject: Subject<any>
  callback: EventCallback
}

type EventCollection = {
  [key in keyof EventMap]?: Event
}

export default class EventHandler {
  protected _subscriptions: SubscriptionStore = {}
  protected _events: EventCollection = {}
  
  public on(eventString: string, callback: EventCallback): void {
    const namespaces = eventString.split('.')
    const eventName = <keyof EventMap>namespaces[0]
    
    const event: Event | undefined = this._events[eventName]
    if (!event) return
    const subscription = event.subject.subscribe({
      next: (data: any) => callback(data)
    })
    this.storeSubscription(namespaces, subscription)
  }
  
  public off(eventString: string): void {
    const namespaces = eventString.split('.')
    for (const namespace of namespaces) this.removeNamespaceSubscriptions(namespace)
  }
  
  protected trigger(eventName: keyof EventMap, ...args: any[]): void {
    const event: Event | undefined = this._events[eventName]
    if (!event) return
    event.subject.next(event.callback(...args))
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
  
  private removeNamespaceSubscriptions(namespace: string): void {
    const subscriptions = this._subscriptions[namespace]
    if (subscriptions) {
      for (const subscription of subscriptions) subscription.unsubscribe()
      this._subscriptions[namespace] = []
    }
  }
  
  protected static setError(message: string, error?: Error): Error {
    if (error) message += ` -> ${error.message}`
    return new Error(message)
  }
  
}
