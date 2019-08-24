import EventCallback from './EventCallback'

type EventMapValue<Return = void> = [string, EventCallback<Return>] | string
export default EventMapValue
