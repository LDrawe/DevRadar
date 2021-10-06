import { Router } from 'express';
import DevController from './controllers/DevController';
import SearchController from './controllers/SearchController';
import Validate from './validators/DevValidation';
const routes = Router();

routes.get('/devs', DevController.index);
routes.get('/devs/search', Validate.SearchDev, SearchController.index);
routes.post('/devs', Validate.CreateDev, DevController.create);

routes.delete('/devs/:github_username', Validate.DeleteDev, DevController.delete);

export default routes;