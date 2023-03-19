export const SOCKET_EVENTS = {
    FILE_CHANGE: 'file-change',
    MISSION_START: 'mission-start',
    MISSION_COMPLETE: 'mission-complete',
    CALIBRATION_START: 'calibration-start',
    CALIBRATION_COMPLETE: 'calibration-complete',
    METRICS_UPDATE: 'metrics-update'
}

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
        if (!SOCKET_EVENTS[event]) {
            console.warn(
                'Event should be one of ',
                Object.keys(SOCKET_EVENTS).join(' | ')
            )
        }
        this.socket.emit(event, { data })
    }
}

export default EventService
