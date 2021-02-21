
const datamanager = require('./datamanager');
var jsonpack = require('jsonpack/main')

let httpServer;
let io;

function initialize(app, port) {
    httpServer = require("http").createServer(app);
    const options = { /* ... */ };
    io = require("socket.io")(httpServer, options);
    
    io.on("connection", socket => {

        console.log("connection received "+socket.id+" "+JSON.stringify(socket.handshake.query));
        socket.on("request_tickers", (query) => {
            if (query) {
                // Subscribe socket to data_updated event
                socket.tickers_query = query;

                // Send data NOW if available
                if (datamanager.data.isReady) socket.emit("tickers_data", jsonpack.pack(datamanager.data.tickersList));
            }
        });

     });

    
    httpServer.listen(port);

    console.log("Socket Initialized on port "+port)
}


datamanager.eventEmitter.on('data_updated', () => {
    console.log('Data Updated event');

    const namespace = io.of("/")
    const sockets = io.of("/").sockets

    for (const [key, value] of sockets.entries()) {
        console.log(value.tickers_query);
        const socket = namespace.to(key);
        socket.emit("tickers_data", jsonpack.pack(datamanager.data.tickersList))
    }

});


exports.initialize = initialize;