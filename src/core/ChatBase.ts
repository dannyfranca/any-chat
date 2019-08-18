import EventMap from "../types/EventMap"
import { Subject } from 'rxjs'
import EventCallback from "../types/EventCallback"
import EventHandler from "./EventHandler"
import EventMapValue from "../types/EventMapValue"
import Timeout = NodeJS.Timeout

export default abstract class ChatBase<ChatApi> extends EventHandler {
  abstract _loader(): Promise<ChatApi> | ChatApi
  
  abstract _eventMap: EventMap
  
  protected _api: ChatApi | undefined
  
  private _eventsMapped: boolean = false
  private _loaded: boolean = false
  
  protected constructor() {
    super()
    this.init()
  }
  
  private async init(): Promise<void> {
    this.on('load', () => this.ready())
    this.mapEvents()
    this._api = await this._loader()
    this.mapEvents()
    this.ready()
  }
  
  protected ready(): void {
    this._loaded = true
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
      let interval: Timeout
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
  
  protected mapEvents(): void {
    if (this._eventsMapped || !this._api) return
    
    for (const prop of Object.keys(this._eventMap) as Array<keyof EventMap>) {
      const callbackTuple: EventMapValue<any> | undefined = this._eventMap[prop]
      if (callbackTuple) {
        let chatCallbackName: string
        let callback: EventCallback
        if (typeof callbackTuple === 'string') {
          chatCallbackName = callbackTuple
          callback = function () {
          }
        } else {
          chatCallbackName = callbackTuple[0]
          callback = callbackTuple[1]
        }
        this._events[prop] = {
          subject: new Subject(),
          callback
        }
        try {
          this.attachEvent(chatCallbackName, (...args) => {
            this.trigger(prop, ...args)
          })
        } catch (e) {
          throw ChatBase.setError('Error setting callbacks in Chat API', e)
        }
      }
    }
    
    this._eventsMapped = true
  }
  
  protected attachEvent(event: string, callback: EventCallback<any>): void {
    // @ts-ignore
    this._api[event] = callback
  }
  
}
