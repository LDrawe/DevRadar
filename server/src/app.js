import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import Cors from 'cors';
import { errors } from 'celebrate';
import { error, notFound } from './controllers/ErrorsController';

const app = express();

mongoose.connect(process.env.MONGO_CONNECTION_STRING);
app.use(Cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(routes);
app.use(errors());

app.use(notFound);
app.use(error);

export default app;