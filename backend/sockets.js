const jsonpack = require('jsonpack/main');
const httpServer = require('http');
const socketIO = require('socket.io');
const dataManager = require('./data_manager');

let io;

function emitFilteredTickers(socket) {
	if (socket) {
		const query = socket.tickers_query;
		if (query) {
			const res = dataManager.getFilteredTickers(query.timeframes, query.markets, query.symbols);
			socket.emit('tickers_data', jsonpack.pack(res));
		}
	}
}

function initialize(app) {
	const server = httpServer.createServer(app);
	io = socketIO(server);

	io.on('connection', (socket) => {
		console.log(`connection received ${socket.id} ${JSON.stringify(socket.handshake.query)}`);

		// Tickers update subscription
		socket.on('request_tickers', (query) => {
			if (query && !socket.tickers_query) {
				try {
					// eslint-disable-next-line
					socket.tickers_query = JSON.parse(query);

					if (dataManager.data.isReady && query) emitFilteredTickers(socket);
				} catch (e) {
					console.log(e.toString());
				}
			}
		});
	});

	return server;
}

dataManager.eventEmitter.on('data_updated', () => {
	const { sockets } = io.of('/');

	console.log(`[data_updated] Sending to ${sockets.size} sockets`);

	// eslint-disable-next-line
	for (const [key, socket] of sockets.entries()) {
		emitFilteredTickers(socket);
	}
});

exports.initialize = initialize;
