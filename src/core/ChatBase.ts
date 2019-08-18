import EventMap from "../types/EventMap"
import { Subject } from 'rxjs'
import EventCallback from "../types/EventCallback"
import EventHandler from "./EventHandler"
import EventMapValue from "../types/EventMapValue"

export default abstract class ChatBase<ChatApi> extends EventHandler {
  abstract _loader(): Promise<ChatApi>
  
  abstract _eventMap: EventMap
  
  protected _api: ChatApi | undefined
  
  private _eventsMapped: boolean = false
  private _loaded: boolean = false
  
  constructor() {
    super()
    this.init()
  }
  
  private init(): void {
    this._loader().then((api: ChatApi) => this._api = api)
    this.mapEvents()
    this.ready()
  }
  
  protected mapEvents(): void {
    if (!this._eventsMapped) return
    if (!(this._api instanceof Object)) throw ChatBase.setError('Chat API not referenced to "this._api" yet')
    
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
  
  protected ready(): void {
    this._loaded = true
  }
  
  protected attachEvent(event: string, callback: EventCallback<any>): void {
    // @ts-ignore
    this._api[event] = callback
  }
  
}
