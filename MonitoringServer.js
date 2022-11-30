import { writeData, connect, disconnect } from "./db.js";
import { MIC_ENUM } from './enums.js';

export default class MonitoringServer {
    sockets = []
    lastRecordTimeStamp = null
    connection_active = false

    constructor() {
        this.sockets = []
        this.lastRecordTimeStamp = null
        this.connection_active = false
    }

    onClientConnect = (sock) => {
        if (!this.connection_active && this.lastRecordTimeStamp) console.log("Last record: ", this.lastRecordTimeStamp.toISOString())
        connect()
        this.connection_active = true
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        this.sockets.push(sock);
        sock.on('data', this.onData);
        // Add a 'close' event handler to this instance of socket
        sock.on('close', () => this.onClientDisconnect(sock));
        // Add a 'close' event handler to this instance of socket
        sock.on('error', this.onSocketError);
        sock.setTimeout(10000);
        sock.on('timeout', () => this.onConnectionTimeout(sock))
    }

    onClientDisconnect = (sock) => {
        disconnect()
        let index = this.sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) this.sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    }

    onConnectionTimeout = (timedOutSocket) => {
        console.log("socket Timeout!")
        this.connection_active = false
        timedOutSocket.end();
    }

    onData = (data) => {
        if (!this.connection_active && this.lastRecordTimeStamp) console.log("Last record: ", this.lastRecordTimeStamp)
        this.lastRecordTimeStamp = new Date()
        this.connection_active = true
        this.parseData(data)
    }

    onSocketError = (data) => {
        console.log("Socket error.")
        disconnect()
        this.connection_active = false
        this.lastRecordTimeStamp = new Date()
    }

    onServerError(data) {
        console.log('Error')
        console.log(data)
    }

    parseData(data) {
        const parsedData = JSON.parse(data)
        let algorithm = null;

        Object.keys(parsedData).filter(key => key !== 'Date').forEach((key, idx) => {
            try {
                algorithm = parsedData[key].Customization[0]

                const data = parsedData[key].Customization.reduce((obj, item, idx) => {
                    const key = MIC_ENUM[idx]
                    return {
                        ...obj,
                        [key]: item,
                    };
                }, {});

                console.log("\n")
                console.log("Sent time: ", parsedData.Date)
                console.log("Recieve time: ", new Date().toLocaleTimeString())

                writeData({ ...data, channel: idx })
            } catch (err) {
                console.log(err.message)
            }

            //console.log(key, algorithm)
        })
    }

}