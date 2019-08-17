import Event from "./Event"

type EventMapValue<Return = void> = [string, Event<Return>]
export default EventMapValue
