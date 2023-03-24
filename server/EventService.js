import { SOCKET_EVENTS } from "../common/enums.mjs";

class EventService {
    static instance;
    constructor(socket) {
        if (EventService.instance) {
            return EventService.instance
        }
        this.socket = socket
        EventService.instance = this
    }

    emit(event, data) {
        if (!Object.values(SOCKET_EVENTS).includes(event)) {
            console.warn(
                'Event should be one of ',
                Object.keys(SOCKET_EVENTS).join(' | ')
            )
        }
        this.socket.emit(event, { data })
    }
}

export default EventService
