import { writeData, connect, disconnect, db } from './db.js'
import { MIC_ENUM, MODE } from '../common/enums.mjs'
import axios from 'axios'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { G_DataInfo, RmsAvg } from '../common/utils/utils.mjs'
import { SOCKET_EVENTS } from '../common/enums.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class MonitoringServer {
    sockets = []
    lastRecordTimeStamp = null
    connection_active = false

    constructor(AppServer) {
        this.sockets = []
        this.lastRecordTimeStamp = null
        this.connection_active = false
        this.counter = 0
        this.buffer = Buffer.alloc(1e6)
        this.tmp = []
        this.AS = AppServer
    }

    handleFetchHistory = (start) => {
        const now = new Date()
        const start_formatted = new Date(
            start.getTime() - start.getTimezoneOffset() * 1000 * 60
        )
            .toISOString()
            .replace('T', '%20')
            .slice(0, -5)
        const end_formatted = new Date(
            now.getTime() - now.getTimezoneOffset() * 1000 * 60
        )
            .toISOString()
            .replace('T', '%20')
            .slice(0, -5)
        console.log(start_formatted)
        console.log(end_formatted)
        axios
            .get(
                `${process.env.CONTROLLER_URI}/history/condition/MCM-204-0/*/${start_formatted}/${end_formatted}/AI0`
            )
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => console.log(err.message))
    }

    onClientConnect = (sock) => {
        if (!this.connection_active && this.lastRecordTimeStamp) {
            console.log('Last record: ', this.lastRecordTimeStamp)
            this.handleFetchHistory(this.lastRecordTimeStamp)
        }
        // db.connect()
        this.connection_active = true
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)
        this.sockets.push(sock)
        sock.on('data', this.onData)
        // Add a 'close' event handler to this instance of socket
        sock.on('close', () => this.onClientDisconnect(sock))
        // Add a 'close' event handler to this instance of socket
        sock.on('error', this.onSocketError)
        //sock.setTimeout(10000);
        sock.on('timeout', () => this.onConnectionTimeout(sock))
    }

    onClientDisconnect = (sock) => {
        // db.disconnect()
        let index = this.sockets.findIndex(function (o) {
            return (
                o.remoteAddress === sock.remoteAddress &&
                o.remotePort === sock.remotePort
            )
        })
        if (index !== -1) this.sockets.splice(index, 1)
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
    }

    onConnectionTimeout = (timedOutSocket) => {
        console.log('socket Timeout!')
        this.connection_active = false
        timedOutSocket.end()
    }

    onData = (data) => {
        if (!this.connection_active && this.lastRecordTimeStamp) {
            this.handleFetchHistory(this.lastRecordTimeStamp)
            console.log('Last record: ', this.lastRecordTimeStamp)
        }
        this.lastRecordTimeStamp = new Date()
        this.connection_active = true

        const chunk = Buffer.from(data)

        if (chunk.toString().endsWith(`"}`)) {
            this.buffer = Buffer.concat([this.buffer, chunk])
            console.log('All chunks have arrived!')
            const str = this.buffer.toString('utf-8').replace(/\0/g, '')
                        
            switch (this.AS.mode) {
                case MODE.TESTING:
                    this.processTestingData(str)
                    break
                case MODE.MONITORING:
                    this.processMonitoringData(str)
                    break
                case MODE.TEST_MONITORING:
                    this.processTestingData(str)
                    break
                case MODE.CALIBRATION:
                    this.processCalibrationData(str)
                    break
            }

            this.buffer.fill(0)
        } else {
            this.buffer = Buffer.concat([this.buffer, chunk])
        }
    }

    onSocketError = (data) => {
        console.log('Socket error.')
        // db.disconnect()
        this.connection_active = false
    }

    onServerError(data) {
        console.log('Error')
        console.log(data)
    }

    processCalibrationData = (data_string) => {
        const data_obj = JSON.parse(data_string)
        const json = JSON.parse(data_string)
        const key = Object.keys(json)[0] //channel
        const data_arr = json[key]['G']
        const res = G_DataInfo(data_arr)
        const scale_factor = 300 * res.rms

        this.AS.eventService.emit(SOCKET_EVENTS.CALIBRATION_COMPLETE, {
            ...res,
            scale_factor,
        })
    }

    processChannelData = (channel, data) => {
        // console.log(channel)
        // console.log(Object.keys(data).join(', '))
        // console.log('---------------------------')

        const isTesting = this.AS.mode === MODE.TESTING

        for (const data_obj in data) {
            if (data_obj === 'G') {
                //convert G to m/s^2
                const transformed_g_data = data['G'].map((el) => el * 10)

                //and write to file .dat
                if (isTesting) {
                    this.AS.saveBinaryFile(
                        transformed_g_data.join(',\n'),
                        transformed_g_data,
                        channel.slice(2)
                    )
                }

                // write signal info into separate file
                const metrics = G_DataInfo(transformed_g_data)
                this.tmp.push({ channel: channel.slice(2), ...metrics })
            } else if (data_obj === 'Customization') {
                const peak = Array.isArray(data['OA_g(Peak)'])
                    ? data['OA_g(Peak)'][0]
                    : undefined
                const rms = Array.isArray(data['OA_g(RMS)'])
                    ? data['OA_g(RMS)'][0]
                    : undefined
                const params = { ...data['Customization'] }

                //do not save files for TEST_MONITORING mode
                if (!isTesting) {
                    this.AS.saveParamFile(params)

                    this.AS.saveMICFile(
                        [
                            channel.slice(2),
                            ...data['Customization'],
                            peak,
                            rms,
                        ].join(', ')
                    )
                }

            }
        }
    }

    processTestingData = (data_string) => {
        let data_obj = {}
        try {
            data_obj = JSON.parse(data_string)
        } catch (err) {
            const idx = String(data_string).indexOf('}{')
            console.log(`Error index ${idx}`)

            const result_array = data_string.split('}{')
            const json = `{${result_array[result_array.length - 1]}`
            data_obj = JSON.parse(json)
        }

        this.tmp = []
        for (const key in data_obj) {
            if (key === 'Date') continue

            //console.log(data_obj[key])
            this.processChannelData(key, data_obj[key])
        }

        //only for conducting experiments (TESTING mode)
        if (this.AS.mode === MODE.TESTING) {
            this.AS.saveMetrics(this.tmp)
            this.AS.updateAllFiles()
        }

        //send metrics to socket
        this.AS.eventService.emit(SOCKET_EVENTS.METRICS_UPDATE, this.tmp)
        //send data to socket
        this.AS.eventService.emit(SOCKET_EVENTS.MISSION_COMPLETE, data_obj)
    }

    processMonitoringData(data_string) {
        this.parseData(data_string)
    }

    parseData(data) {
        const parsedData = JSON.parse(data)
        console.log(parsedData)
        let algorithm = null

        Object.keys(parsedData)
            .filter((key) => key !== 'Date')
            .forEach((key, idx) => {
                try {
                    // const data_types = Object.keys(parsedData[key])
                    // console.log(data_types)
                    algorithm = parsedData[key].Customization[0]

                    const data = parsedData[key].Customization.reduce(
                        (obj, item, idx) => {
                            const key = MIC_ENUM[idx]
                            return {
                                ...obj,
                                [key]: item,
                            }
                        },
                        {}
                    )

                    console.log('\n')
                    console.log('Sent time: ', parsedData.Date)
                    console.log(
                        'Recieve time: ',
                        new Date().toLocaleTimeString()
                    )

                    db.writeData({
                        ...data,
                        channel: idx,
                        timestamp: parsedData.Date,
                    })
                } catch (err) {
                    console.log(err.message)
                }

                //console.log(key, algorithm)
            })
    }
}
