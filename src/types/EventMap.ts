import State from "./State"
import EventMapValue from "./EventMapValue"

export default interface EventMap {
  stateChange?: EventMapValue<State>
  preSubmit?: EventMapValue<object>
  offlineSubmit?: EventMapValue<object>
  load?: EventMapValue
  open?: EventMapValue
  close?: EventMapValue
  start?: EventMapValue
  end?: EventMapValue
  hidden?: EventMapValue
  callStart?: EventMapValue
  callEnd?: EventMapValue
  resize?: EventMapValue
}
