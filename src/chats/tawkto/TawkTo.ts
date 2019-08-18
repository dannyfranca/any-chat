import TawkToTsd from "./TawkToTsd"
import ChatBase from "../../core/ChatBase"
import EventMap from "../../types/EventMap"
import MethodMap from "../../types/MethodMap"
import State from "../../types/State"
import StringNumberObject from "../../types/StringNumberObject"

declare global {
  interface Window {
    Tawk_API: TawkToTsd
    Tawk_LoadStart: Date
  }
}

export default class TawkTo extends ChatBase<TawkToTsd> implements MethodMap {
  
  constructor(private readonly _id: string) {
    super()
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
    s1.src = `https://embed.tawk.to/${this._id}/default`
    s1.charset = 'UTF-8'
    s1.setAttribute('crossorigin', '*')
    // @ts-ignore
    s0.parentNode.insertBefore(s1, s0)
    
    return window.Tawk_API
  }
  
  public addTags(tags: string[], callback?: Function): void {
    window.Tawk_API.addTags(tags, callback)
  }
  
  public close(): void {
    window.Tawk_API.minimize()
  }
  
  public end(): void {
    window.Tawk_API.endChat()
  }
  
  public event(eventName: string, data?: StringNumberObject, callback?: Function): void {
    window.Tawk_API.addEvent(eventName, data, callback)
  }
  
  public isChatting(): boolean {
    return window.Tawk_API.isChatOngoing()
  }
  
  public isClosed(): boolean {
    return window.Tawk_API.isChatMinimized()
  }
  
  public isEngaged(): boolean {
    return window.Tawk_API.isVisitorEngaged()
  }
  
  public isHidden(): boolean {
    return window.Tawk_API.isChatHidden()
  }
  
  public isOnline(): boolean {
    return window.Tawk_API.getStatus() == 'online'
  }
  
  public isOffline(): boolean {
    return window.Tawk_API.getStatus() == 'offline'
  }
  
  public isAway(): boolean {
    return window.Tawk_API.getStatus() == 'away'
  }
  
  public isOpen(): boolean {
    return window.Tawk_API.isChatMaximized()
  }
  
  public open(): void {
    window.Tawk_API.maximize()
  }
  
  public popup(): void {
    window.Tawk_API.popup()
  }
  
  public removeTags(tags: string[], callback?: Function): void {
    window.Tawk_API.removeTags(tags, callback)
  }
  
  public setVisitorData(data: object): void {
    window.Tawk_API
  }
  
  public state(): State {
    return window.Tawk_API.getStatus()
  }
  
  public toggle(): void {
    window.Tawk_API.toggle()
  }
  
  public visitorData(): TawkToTsd['visitor'] {
    return window.Tawk_API.visitor
  }
  
}
