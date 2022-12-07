import net from "net"
import AppServer from "./AppServer.js";
import MonitoringServer from "./MonitoringServer.js";

const port = 7070;
const host = '0.0.0.0';
const server = net.createServer();

const AS = new AppServer()
const MS = new MonitoringServer(AS)


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

