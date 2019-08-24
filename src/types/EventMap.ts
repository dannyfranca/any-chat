import State from './State'
import EventMapValue from './EventMapValue'

export default interface EventMap {
  load: EventMapValue
  stateChange?: EventMapValue<State>
  preSubmit?: EventMapValue<object>
  offlineSubmit?: EventMapValue<object>
  open?: EventMapValue
  close?: EventMapValue
  start?: EventMapValue
  end?: EventMapValue
  hidden?: EventMapValue
  callStart?: EventMapValue
  callEnd?: EventMapValue
  resize?: EventMapValue
}
