export default class MonitoringServer {
    constructor() {
        this.sockets = []
    }

    onClientConnect(sock) {
        connect()
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        this.sockets.push(sock);
        sock.on('data', processData);
        // Add a 'close' event handler to this instance of socket
        sock.on('close', () => this.onClientDisconnect(sock));
        // Add a 'close' event handler to this instance of socket
        sock.on('error', this.onSocketError);
        sock.setTimeout(5000);
    }

    onClientDisconnect(sock) {
        disconnect()
        let index = this.sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) this.sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    }

    onConnectionTimeout(timedOutSocket) {
        timedOutSocket.write('socket timed out!');
        timedOutSocket.end();
    }

    onData(data) {
        processData(data)
    }

    onSocketError(data) {
        console.log("Socket error.")
    }

}