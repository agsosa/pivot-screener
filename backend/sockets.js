
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
            if (query && !socket.tickers_query) {
                // Subscribe socket to data_updated event
                try {
                    //console.log("received query = "+query)
                    query = JSON.parse(query);
                    socket.tickers_query = query;
                    //console.log(JSON.stringify(query)+" connected")

                    // Send data NOW if available
                    // TODO: Arreglar, enviar filtrada
                    if (datamanager.data.isReady && query) socket.emit("tickers_data", jsonpack.pack(datamanager.getFilteredTickers(query.timeframes, query.markets, query.symbols)))
                }
                catch (e) {
                    console.log(e.toString());
                }
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
        const socket = namespace.to(key);
        const query = value.tickers_query;
        if (query) {
            console.log("datamanagerEventEmitter " + JSON.stringify(query));
            socket.emit("tickers_data", jsonpack.pack(datamanager.getFilteredTickers(query.timeframes, query.markets, query.symbols)))
        }

        //
    }

});


exports.initialize = initialize;