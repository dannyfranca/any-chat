import StringNumberObject from "../../types/StringNumberObject"

type Status = 'online' | 'offline' | 'away'
interface VisitorInfo extends StringNumberObject {
  name?: string
  email?: string
  hash?: string
}

export default interface TawkToTsd {
  onLoad: () => any
  onStatusChange: (status: Status) => any
  onBeforeLoad: () => any
  onChatMaximized: () => any
  onChatMinimized: () => any
  onChatHidden: () => any
  onChatStarted: () => any
  onChatEnded: () => any
  onPrechatSubmit: () => any
  onOfflineSubmit: () => any
  visitor: VisitorInfo
  maximize: () => void
  minimize: () => void
  toggle: () => void
  popup: () => void
  getWindowType: () => 'inline' | 'embed'
  showWidget: () => void
  hideWidget: () => void
  toggleVisibility: () => void
  getStatus: () => Status
  isChatMaximized: () => boolean
  isChatMinimized: () => boolean
  isChatHidden: () => boolean
  isChatOngoing: () => boolean
  isVisitorEngaged: () => boolean
  endChat: () => void
  setAttributes: (data: VisitorInfo, callback?: Function) => void
  addEvent: (eventName: string, metadata?: StringNumberObject, callback?: Function) => void
  addTags: (tags: string[], callback?: Function) => void
  removeTags: (tags: string[], callback?: Function) => void
}
