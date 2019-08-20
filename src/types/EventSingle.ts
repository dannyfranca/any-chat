import { Subject } from "rxjs"
import EventCallback from "./EventCallback"

type EventSingle = {
  subject: Subject<any>
  callbackName: string
  callback: EventCallback
}

export default EventSingle
