import net from "net"
import { main, writeData, connect, disconnect, db } from "./db.js";
const port = 7070;
const host = '0.0.0.0';
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

