import CommonRoutesConfig from './common.routes.config';
import express from 'express';
import DataManager from '../data/DataManager';

export default class TickersRoutes extends CommonRoutesConfig {
	constructor(app: express.Application, dataManager: DataManager) {
		super(app, dataManager, 'TickersRoutes');
	}

	configureRoutes() {
		// Get symbols list (example: [ "BTCUSDT", "ETHUSDT", "ADAUSDT", ...])
		// Optional query parameter: markets - comma delimited list of MarketEnum (example: ?markets=cryptocurrency,forex,stocks)
		// TODO: Add support for exchanges
		this.app.route(`/tickers/symbols`).get((req: express.Request, res: express.Response, next: express.NextFunction) => {
			try {
				const { markets } = req.query;

				res.json(this.dataManager.getSymbolsList(markets?.toString()));
			} catch (e) {
				const error = new Error(e.toString());
				res.status(404);
				next(error);
			}
		});

		return this.app;
	}
}
