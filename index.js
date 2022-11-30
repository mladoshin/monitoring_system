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

server.on('connection', MS.onClientConnect);
server.on('timeout', MS.onConnectionTimeout);
server.on('error', MS.onServerError);
server.on('close', () => consoe.log("Closing"))

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

