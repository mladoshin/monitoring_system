import { writeData, connect, disconnect, db } from "./db.js";
import { MIC_ENUM } from './enums.js';
import axios from 'axios';

export default class MonitoringServer {
    sockets = []
    lastRecordTimeStamp = null
    connection_active = false

    constructor() {
        this.sockets = []
        this.lastRecordTimeStamp = null
        this.connection_active = false
        this.counter = 0
    }

    handleFetchHistory = (start) => {
        const now = new Date()
        const start_formatted = new Date(start.getTime() - start.getTimezoneOffset() * 1000 * 60).toISOString().replace('T','%20').slice(0, -5);
        const end_formatted = new Date(now.getTime() - now.getTimezoneOffset() * 1000 * 60).toISOString().replace('T','%20').slice(0, -5);
        console.log(start_formatted)
        console.log(end_formatted)
        axios.get(`http://192.168.1.172:6166/history/condition/MCM-204-0/*/${start_formatted}/${end_formatted}/AI0`)
        .then((res) => {
            console.log(res.data)
        })
        .catch(err => console.log(err.message))

    }

    onClientConnect = (sock) => {
        if (!this.connection_active && this.lastRecordTimeStamp) {
            console.log("Last record: ", this.lastRecordTimeStamp)
            this.handleFetchHistory(this.lastRecordTimeStamp)
        }
        // db.connect()
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
        // db.disconnect()
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
        if (!this.connection_active && this.lastRecordTimeStamp) {
            this.handleFetchHistory(this.lastRecordTimeStamp)
            console.log("Last record: ", this.lastRecordTimeStamp)
        }
        this.lastRecordTimeStamp = new Date()
        this.connection_active = true
        this.parseData(data)

    }

    onSocketError = (data) => {
        console.log("Socket error.")
        // db.disconnect()
        this.connection_active = false
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

                db.writeData({ ...data, channel: idx })
            } catch (err) {
                console.log(err.message)
            }

            //console.log(key, algorithm)
        })
    }

}