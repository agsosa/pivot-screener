import express from 'express';
import DataManager from '../data/DataManager';

export default abstract class CommonRoutesConfig {
	app: express.Application;
	dataManager: DataManager;
	name: string;

	constructor(app: express.Application, dataManager: DataManager, name: string) {
		this.app = app;
		this.name = name;
		this.dataManager = dataManager;
		this.configureRoutes();
	}

	getName() {
		return this.name;
	}

	abstract configureRoutes(): express.Application;
}
