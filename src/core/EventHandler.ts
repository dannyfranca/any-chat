import EventMap from '../types/EventMap'
import { Subject, Subscription } from 'rxjs'
import EventCallback from '../types/EventCallback'
import EventMapValue from '../types/EventMapValue'
import EventSingle from '../types/EventSingle'
import EventCollection from '../types/EventCollection'

type SubscriptionStore = {
  [key: string]: Subscription[]
}

export default abstract class EventHandler {
  abstract _eventMap: EventMap
  protected _subscriptions: SubscriptionStore = {}
  protected _events: EventCollection = {}

  public on(eventString: string, callback: EventCallback): void {
    const namespaces = eventString.split('.')
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const eventName = <keyof EventMap>namespaces[0]

    const event = this._events[eventName]
    if (!event) return
    const subscription = event.subject.subscribe({
      next: (data: any) => {
        callback(data)
      }
    })
    this.storeSubscription(namespaces, subscription)
  }

  public off(eventString: string): void {
    const namespaces = eventString.split('.')
    for (const namespace of namespaces)
      this.removeNamespaceSubscriptions(namespace)
  }

  protected init() {
    this.mapEvents()
  }

  private mapEvents(): void {
    for (const prop of Object.keys(this._eventMap) as Array<keyof EventMap>) {
      const callbackTuple: EventMapValue<any> | undefined = this._eventMap[prop]
      if (!callbackTuple) continue
      let callbackName: string
      let callback: EventCallback
      if (typeof callbackTuple === 'string') {
        callbackName = callbackTuple
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback = function() {}
      } else {
        callbackName = callbackTuple[0]
        callback = callbackTuple[1]
      }
      this._events[prop] = {
        subject: new Subject(),
        callbackName,
        callback
      }
    }
  }

  protected trigger(eventName: keyof EventMap, ...args: any[]): void {
    const event: EventSingle | undefined = this._events[eventName]
    if (!event) return
    event.subject.next(event.callback(...args))
  }

  public hasEvent(eventName: keyof EventMap): boolean {
    return Boolean(this._events[eventName])
  }

  private storeSubscription(
    namespaces: string[],
    subscription: Subscription
  ): void {
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
