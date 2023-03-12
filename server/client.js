const net = require('net');
const client = new net.Socket();
const port = 7070;
const host = '127.0.0.1';

//write data to socket
function writeToSocket(data) {
    return new Promise((resolve, reject) => {
        client.write(data, (err) => {
            if (err) {
                reject(new Error(err))
            } else {
                resolve("Success!")
            }
        });
    })
}

//connect to socket
function connectToServer() {
    console.log("Trying to connect to socket!")

    client.connect(port, host, function () {
        console.log('Connected');
        client.write("Hello From Client " + client.address().address);

        let counter = 0
        setTimeout(function run() {

            const res = writeToSocket(`Clinet's request #${counter}`).catch(err => console.log(err))
            counter++

            setTimeout(run, 5000)
        }, 5000)
    });

    client.on('data', function (data) {
        console.log('Server Says : ' + data);
    });
    
    //hnadle errors
    client.on('error', function (err) {
        client.destroy()
    });
    
    //reconnect to socket
    client.on('close', function (err) {
        client.removeAllListeners()
        setTimeout(connectToServer, 5000)
    });
}


connectToServer()