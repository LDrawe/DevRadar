import { Router } from 'express';
import DevController from './controllers/DevController';
import SearchController from './controllers/SearchController';

const routes = Router();

routes.get('/devs', DevController.index);
routes.get('/devs/search', SearchController.index);
routes.post('/devs', DevController.create);

export default routes;