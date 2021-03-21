import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import CommonRoutesConfig from './api/common.routes.config';
import TickersRoutes from './api/tickers.routes.config';
import helmet from 'helmet';
import compression from 'compression';
import DataManager from './data/DataManager';
import BinanceFutures from './exchanges/BinanceFutures';
import Sockets from './api/Sockets';

const app: express.Application = express();
//const server: http.Server = http.createServer(app); // Using server returned from Sockets.start()
let port: any = process.env.PORT;
if (!port) port = 4001;
const routes: CommonRoutesConfig[] = [];

// TODO: Add rate limiter

// Express middlewares
app.use(helmet());
app.use(compression());
app.use(
	cors({
		origin: ['https://pivotscreener.com', 'https://pivotscreener.netlify.app', 'http://localhost:3000'],
	})
);

// Initialize modules
const dataManager: DataManager = new DataManager();
const sockets: Sockets = new Sockets(app, dataManager);
const server = sockets.start();
const binanceFutures: BinanceFutures = new BinanceFutures(dataManager);
routes.push(new TickersRoutes(app, dataManager));

app.use(
	expressWinston.errorLogger({
		transports: [new winston.transports.Console()],
		format: winston.format.combine(winston.format.colorize(), winston.format.json()),
	})
);

app.get('/', (req: express.Request, res: express.Response) => {
	res.status(200).send(`OK`);
});

server.listen(port, () => {
	console.log(`Server running at port ${port}`);

	routes.forEach((route: CommonRoutesConfig) => {
		console.log(`Routes configured for ${route.getName()}`);
	});
});
