const jsonpack = require('jsonpack/main');
const datamanager = require('./data_manager');

let httpServer;
let io;

function initialize(app, port) {
	httpServer = require('http').createServer(app);
	io = require('socket.io')(httpServer);

	io.on('connection', (socket) => {
		console.log(`connection received ${socket.id} ${JSON.stringify(socket.handshake.query)}`);

		socket.on('request_tickers', (query) => {
			if (query && !socket.tickers_query) {
				try {
					query = JSON.parse(query);
					socket.tickers_query = query;

					if (datamanager.data.isReady && query) socket.emit('tickers_data', jsonpack.pack(datamanager.getFilteredTickers(query.timeframes, query.markets, query.symbols)));
				} catch (e) {
					console.log(e.toString());
				}
			}
		});
	});

	return httpServer;
}

datamanager.eventEmitter.on('data_updated', () => {
	const namespace = io.of('/');
	const { sockets } = io.of('/');

	console.log(`[data_updated] Sending to ${sockets.size} sockets`);

	for (const [key, socket] of sockets.entries()) {
		const query = socket.tickers_query;
		if (query) {
			const res = datamanager.getFilteredTickers(query.timeframes, query.markets, query.symbols);
			socket.emit('tickers_data', jsonpack.pack(res));
		}
	}
});

exports.initialize = initialize;
