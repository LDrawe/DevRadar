import { Server } from "socket.io";
import parseStringasArray from "../utils/parseStringasArray";
import { getDistanceFromLatLonInKm } from '../utils/calculateDistance';

export const connections = [];
let io;

export function findConnections(coordinates, techs) {
	const conexoes = connections.filter(connection =>
		getDistanceFromLatLonInKm(coordinates, connection.coordinates) < 10
			&& connection.techs.some(item => techs.includes(item))
	);
	return conexoes;
}

export function sendMessage(to, message, data) {
	to.forEach(connection => io.to(connection.id).emit(message, data));
}

export default function setupWebSockets(server) {
	io = new Server(server);

	io.on('connection', socket => {
		const { latitude, longitude, techs } = socket.handshake.query;
		connections.push({
			id: socket.id,
			coordinates: {
				latitude: Number(latitude),
				longitude: Number(longitude),
			},
			techs: parseStringasArray(techs)
		});
	});
}