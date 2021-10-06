require('dotenv').config();
import app from "./src/app";
import http from 'http';
import setupWebSockets from './src/modules/websocket';
const server = http.Server(app);

setupWebSockets(server);

server.listen(3333, () => console.log('💻 Server Online'));
