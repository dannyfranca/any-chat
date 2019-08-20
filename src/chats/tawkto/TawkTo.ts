import TawkToTsd from "./TawkToTsd"
import ChatBase from "../../core/ChatBase"
import EventMap from "../../types/EventMap"
import MethodMap from "../../types/MethodMap"
import State from "../../types/State"
import StringNumberObject from "../../types/StringNumberObject"
import { jsApiMethod } from "../../core/decorators"

declare global {
  interface Window {
    Tawk_API: TawkToTsd
    Tawk_LoadStart: Date
  }
}

export default class TawkTo extends ChatBase<TawkToTsd> implements MethodMap {
  
  constructor(private readonly _id: string) {
    super()
    super.init()
  }
  
  _eventMap: EventMap = {
    load: 'onLoad',
    stateChange: 'onStatusChange',
    preSubmit: ['onPrechatSubmit', (data: object) => data],
    offlineSubmit: ['onOfflineSubmit', (data: object) => data],
    open: 'onChatMaximized',
    close: 'onChatMinimized',
    start: 'onChatStarted',
    end: 'onChatEnded',
    hidden: 'onChatHidden'
  }
  
  _loader(): TawkToTsd {
    window.Tawk_API = window.Tawk_API || {}
    
    // TawkTo events need to be set before instance is created
    this._api = window.Tawk_API
    
    // Load main chat script
    window.Tawk_LoadStart = new Date()
    const s1 = document.createElement('script')
    const s0 = document.getElementsByTagName('script')[0]
    s1.async = true
    s1.src = `https://embed.tawk.to/${this._id}`
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    // @ts-ignore
    s0.parentNode.insertBefore(s1, s0)
    
    return window.Tawk_API
  }
  
  @jsApiMethod()
  public async open(): Promise<void> {
    window.Tawk_API.maximize()
  }
  
  @jsApiMethod()
  public async close(): Promise<void> {
    window.Tawk_API.minimize()
  }
  
  @jsApiMethod()
  public async end(): Promise<void> {
    window.Tawk_API.endChat()
  }
  
  @jsApiMethod()
  public async event(eventName: string, data?: StringNumberObject): Promise<void> {
    return new Promise((resolve, reject) => {
      window.Tawk_API.addEvent(eventName, data, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }
  
  @jsApiMethod()
  public async popup(): Promise<void> {
    window.Tawk_API.popup()
  }
  
  @jsApiMethod()
  public async addTags(tags: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      window.Tawk_API.addTags(tags, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }
  
  @jsApiMethod()
  public async removeTags(tags: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      window.Tawk_API.removeTags(tags, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }
  
  @jsApiMethod()
  public async setVisitorData(data: TawkToTsd['visitor']): Promise<void> {
    return new Promise((resolve, reject) => {
      window.Tawk_API.setAttributes(data, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }
  
  @jsApiMethod()
  public async toggle(): Promise<void> {
    window.Tawk_API.toggle()
  }
  
  @jsApiMethod()
  public isChatting(): boolean {
    return window.Tawk_API.isChatOngoing()
  }
  
  @jsApiMethod()
  public isClosed(): boolean {
    return window.Tawk_API.isChatMinimized()
  }
  
  @jsApiMethod()
  public isEngaged(): boolean {
    return window.Tawk_API.isVisitorEngaged()
  }
  
  @jsApiMethod()
  public isHidden(): boolean {
    return window.Tawk_API.isChatHidden()
  }
  
  @jsApiMethod()
  public isOnline(): boolean {
    return window.Tawk_API.getStatus() == 'online'
  }
  
  @jsApiMethod()
  public isOffline(): boolean {
    return window.Tawk_API.getStatus() == 'offline'
  }
  
  @jsApiMethod()
  public isAway(): boolean {
    return window.Tawk_API.getStatus() == 'away'
  }
  
  @jsApiMethod()
  public isOpen(): boolean {
    return window.Tawk_API.isChatMaximized()
  }
  
  @jsApiMethod()
  public state(): State {
    return window.Tawk_API.getStatus()
  }
  
}
