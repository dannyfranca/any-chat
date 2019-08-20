import EventMap from "../types/EventMap"
import EventCallback from "../types/EventCallback"
import EventHandler from "./EventHandler"

export default abstract class ChatBase<ChatApi> extends EventHandler {
  abstract _eventMap: EventMap
  abstract _loader(): Promise<ChatApi> | ChatApi
  
  protected _api: ChatApi | undefined
  
  private _eventsMapped: boolean = false
  private _loaded: boolean = false
  
  protected async init(): Promise<void> {
    super.init()
    this.on('load', () => this.ready())
    this.mapApiEvents()
    this._api = await this._loader()
    this.mapApiEvents()
    this.ready()
  }
  
  protected ready(): void {
    this._loaded = true
  }
  
  get loaded(): boolean {
    return this._loaded
  }
  
  public toLoad(): Promise<void> {
    if (this._loaded) return Promise.resolve()
    return new Promise(resolve => this.on('load', () => resolve()))
  }
  
  public then(resolve?: (chat?: this) => any, reject?: (chat?: this) => any): Promise<any> {
    let valueFromCallback
    if (this._loaded) {
      try {
        valueFromCallback = resolve ? resolve(this) : undefined
      } catch (e) {
        return Promise.reject(reject ? reject(e) : e)
      }
      return Promise.resolve(valueFromCallback)
    }
    return new Promise((res, rej) => {
      this.on('load', () => {
        try {
          valueFromCallback = resolve ? resolve(this) : undefined
        } catch (e) {
          return rej(reject ? reject(e) : e)
        }
        res(valueFromCallback)
      })
    })
  }
  
  protected waitFor(test: () => any, then: () => any, testInterval: number = 200, limit: number = 10000): Promise<any> {
    try {
      if (test()) return Promise.resolve(then())
    } catch (e) {
      return Promise.reject(e)
    }
    return new Promise((resolve, reject) => {
      let interval: NodeJS.Timeout
      let count = 0
      try {
        interval = setInterval(() => {
          if (count > limit) {
            clearInterval(interval)
            reject(`Wait time passed the allowed limit ${limit}`)
          }
          if (test()) {
            clearInterval(interval)
            resolve(then())
          }
          count += testInterval
        }, testInterval)
      } catch (e) {
        reject('Error setting interval')
      }
    })
  }
  
  private mapApiEvents(): void {
    if (this._eventsMapped || !this._api) return
    
    for (const prop of Object.keys(this._events) as Array<keyof EventMap>) {
      const event = this._events[prop]
      if (!event) continue
        try {
          this.attachEvent(event.callbackName, (...args) => {
            this.trigger(prop, ...args)
          })
        } catch (e) {
          throw ChatBase.setError('Error setting callbacks in Chat API', e)
        }
    }
    
    this._eventsMapped = true
  }
  
  protected attachEvent(event: string, callback: EventCallback<any>): void {
    // @ts-ignore
    this._api[event] = callback
  }
  
}
