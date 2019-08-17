import State from "./State"
import StringNumberObject from "./StringNumberObject"

export default interface MethodMap {
  visitorData?: () => object
  setVisitorData?: (data: object) => void
  event?: (eventName:string, data?: StringNumberObject, callback?: Function) => void
  addTags?: (tags: string[], callback?: Function) => void
  removeTags?: (tags: string[], callback?: Function) => void
  end?: () => void
  open?: () => void
  close?: () => void
  toggle?: () => void
  popup?: () => void
  state?: () => State
  isOnline?: () => boolean
  isOffline?: () => boolean
  isAway?: () => boolean
  isOpen?: () => boolean
  isClosed?: () => boolean
  isHidden?: () => boolean
  isEngaged?: () => boolean
  isChatting?: () => boolean
}
