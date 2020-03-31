import { Router } from 'express';
import common from './routes/common';
import network from './routes/network';

export default () => {
	const app = Router();
	common(app);
	network(app);

	return app
}