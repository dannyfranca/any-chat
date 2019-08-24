import StringNumberObject from '../../types/StringNumberObject'

type Status = 'online' | 'offline' | 'away'
interface VisitorInfo extends StringNumberObject {
  name?: string
  email?: string
  hash?: string
}

type Callback<E = Error> = (error?: E) => void

export default interface TawkToTsd {
  visitor: VisitorInfo
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
  setAttributes: (data: VisitorInfo, callback?: Callback) => void
  addEvent: (
    eventName: string,
    metadata?: StringNumberObject,
    callback?: Callback
  ) => void
  addTags: (tags: string[], callback?: Callback) => void
  removeTags: (tags: string[], callback?: Callback) => void
}
