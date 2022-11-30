import net from "net"
import { main, writeData, connect, disconnect } from "./db.js";
const port = 7070;
const host = '0.0.0.0';
import { MIC_ENUM } from './enums.js';
import MonitoringServer from "./MonitoringServer.js";

const server = net.createServer();
const MS = new MonitoringServer()

server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});

let sockets = [];

server.on('connection', function (sock) {
    connect()

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    sock.on('data', processData);

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        disconnect()
        let index = sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('error', function (data) {
        console.log(data)
    });

    sock.setTimeout(5000);
});

// process.on('uncaughtException', function () {
//     /* ignore error */
//     console.log("error")
// });

server.on('timeout', MS.onConnectionTimeout);

process.on('SIGINT', function () {
    console.log("Caught interrupt signal");

    server.getConnections((err, count) => console.log(count))
    server.close();
    process.exit();
}
);

function processMIC(data) {
    console.log(data.keys())
}

function processData(data) {
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

// class MonitoringServer {
//     constructor() {
//         this.sockets = []
//     }

//     onClientConnect(sock) {
//         connect()
//         console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
//         this.sockets.push(sock);
//         sock.on('data', processData);
//         // Add a 'close' event handler to this instance of socket
//         sock.on('close', () => this.onClientDisconnect(sock));
//         // Add a 'close' event handler to this instance of socket
//         sock.on('error', this.onSocketError);
//         sock.setTimeout(5000);
//     }

//     onClientDisconnect(sock) {
//         disconnect()
//         let index = this.sockets.findIndex(function (o) {
//             return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
//         })
//         if (index !== -1) this.sockets.splice(index, 1);
//         console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
//     }

//     onConnectionTimeout(timedOutSocket) {
//         timedOutSocket.write('socket timed out!');
//         timedOutSocket.end();
//     }

//     onData(data) {
//         processData(data)
//     }

//     onSocketError(data) {
//         console.log("Socket error.")
//     }

// }

