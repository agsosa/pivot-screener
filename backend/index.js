// TODO: DOCUMENTAR Y TESTEAR API
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const jsonpack = require('jsonpack/main');
const { validate, ValidationError, Joi } = require('express-validation');

const datamanager = require('./data_manager');
const binanceFutures = require('./binance_futures');
const sockets = require('./sockets');

const app = express();

binanceFutures.doUpdate();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express-validation
app.use((err, req, res) => {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json(err);
	}

	return res.status(500).json(err);
});

let port = process.env.PORT;
if (!port) port = 4000;
const httpServer = sockets.initialize(app, port);

console.log(`Socket initialized on port ${port}`);

app.get('*', (req, res, next) => {
	if (!datamanager.data.isReady) {
		const error = new Error('Not ready');
		error.status = 404;
		next(error);
	} else next();
});

app.get('/', (req, res) => {
	res.send('OK');
});

const symbolListValidation = {
	query: Joi.object({
		markets: Joi.string().optional(),
	}),
};

app.get('/api/symbols-list', validate(symbolListValidation, {}, {}), (req, res, next) => {
	try {
		const { markets } = req.query;

		res.json(datamanager.getSymbolsList(markets));
	} catch (e) {
		const error = new Error(e.toString());
		error.msg = e.toString();
		error.status = 404;
		next(error);
	}
});

httpServer.listen(port, () => console.log(`Server listening on port ${port}`));
