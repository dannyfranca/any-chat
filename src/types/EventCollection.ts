import EventMap from "./EventMap"
import EventSingle from "./EventSingle"

type EventCollection = {
  [key in keyof EventMap]?: EventSingle
}

export default EventCollection
