import { Router } from 'express';
import common from './routes/common';

export default () => {
	const app = Router();
	common(app);

	return app
}