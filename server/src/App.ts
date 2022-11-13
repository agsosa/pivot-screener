import 'module-alias/register';
import 'newrelic';
import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import DataManager from 'data/DataManager';
import Sockets from 'api/Sockets';
import { InitializeExchanges } from 'exchanges/ExchangesManager';

const app: express.Application = express();
// const server: http.Server = http.createServer(app); // Using server returned from Sockets.start()
let port: any = process.env.PORT || 8080;

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
InitializeExchanges(dataManager);
const sockets: Sockets = new Sockets(app, dataManager);
const server = sockets.start();

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
});
