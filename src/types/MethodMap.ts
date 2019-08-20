import State from "./State"
import StringNumberObject from "./StringNumberObject"

export default interface MethodMap {
  setVisitorData?: (data: StringNumberObject) => Promise<void>
  event?: (eventName: string, data?: StringNumberObject) => Promise<void>
  addTags?: (tags: string[]) => Promise<void>
  removeTags?: (tags: string[]) => Promise<void>
  end?: () => Promise<void>
  open?: () => Promise<void>
  close?: () => Promise<void>
  toggle?: () => Promise<void>
  popup?: () => Promise<void>
  state?: () => State
  visitorData?: () => object
  isOnline?: () => boolean
  isOffline?: () => boolean
  isAway?: () => boolean
  isOpen?: () => boolean
  isClosed?: () => boolean
  isHidden?: () => boolean
  isEngaged?: () => boolean
  isChatting?: () => boolean
}
