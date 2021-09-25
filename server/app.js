import express from 'express';
import mongoose from 'mongoose';
import routes from './src/routes';

const app = express();

mongoose.connect('mongodb+srv://devradar_admin:devradar_password@cluster0.ijqea.mongodb.net/OmniStack10?retryWrites=true&w=majority');

app.use(express.json());
app.use(routes);

app.listen(3333, () => console.log('💻 Server Online'));