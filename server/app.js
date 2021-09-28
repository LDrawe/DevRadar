import express from 'express';
import mongoose from 'mongoose';
import routes from './src/routes';
import Cors from 'cors';
import { error, notFound } from './src/controllers/ErrorsController';
const app = express();

mongoose.connect('mongodb+srv://devradar_admin:devradar_password@cluster0.ijqea.mongodb.net/OmniStack10?retryWrites=true&w=majority');
app.use(Cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(routes);

app.use(notFound);
app.use(error);

app.listen(3333, () => console.log('💻 Server Online'));