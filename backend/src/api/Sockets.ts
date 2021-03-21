import express from 'express';
import { createServer, Server as httpServer } from 'http';
import { Server, Socket } from 'socket.io';
import DataManager from '../data/DataManager';
import jsonpack from 'jsonpack';

interface Query {
	timeframes: string; // Examples: "daily, monthly, weekly"; "daily"; "hourly, weekly"
	markets: string; // Examples: "cryptocurrency, forex" MarketEnum
	symbols: string; // Examples: "BTCUSDT"; "BTCUSDT, ADAUSDT, ETHUSDT"
}

interface ExtSocket extends Socket {
	tickersQuery: Query;
}

export default class Sockets {
	private server: any;
	private io: any;
	private app: express.Application;
	private dataManager: DataManager;

	constructor(app: express.Application, dataManager: DataManager) {
		this.dataManager = dataManager;
		this.app = app;
	}

	start(): httpServer {
		this.server = createServer(this.app);
		this.io = new Server(this.server, { cors: { origin: ['https://pivotscreener.com', 'https://pivotscreener.netlify.app', 'http://localhost:3000'] } });

		this.handleConnections();
		this.handleIODataManagerEvents();

		return this.server;
	}

	handleConnections(): void {
		this.io.on('connection', (socket: ExtSocket) => {
			this.handleSocketRequestTickers(socket);
		});
	}

	// Clients subscription to tickers data updates
	handleSocketRequestTickers(socket: ExtSocket): void {
		socket.on('request_tickers', (query) => {
			if (query && !socket.tickersQuery) {
				try {
					socket.tickersQuery = JSON.parse(query);

					if (socket.tickersQuery) {
						this.emitFilteredTickersTo(socket);
					}
				} catch (e) {
					console.log(e.toString());
				}
			}
		});
	}

	// Emit on data_updated event
	handleIODataManagerEvents(): void {
		this.dataManager.eventEmitter.on('data_updated', () => {
			const { sockets } = this.io.of('/');

			for (const [key, socket] of sockets.entries()) {
				this.emitFilteredTickersTo(socket);
			}
		});
	}

	emitFilteredTickersTo(socket: ExtSocket): void {
		if (socket) {
			const query = socket.tickersQuery;
			if (query) {
				const res = this.dataManager.getFilteredTickers(query.timeframes, query.markets, query.symbols);
				socket.emit('tickers_data', jsonpack.pack(res));
			}
		}
	}
}
