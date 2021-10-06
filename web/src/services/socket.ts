import socketio from 'socket.io-client';

const socket = socketio(`http://localhost:3333`, {
	autoConnect: false
});

function connect(latitude: string, longitude: string, techs: string) {
	socket.io.opts.query = {
		latitude,
		longitude,
		techs
	}
	socket.connect();
}

function disconnect() {
	if (socket.connected) {
		socket.disconnect();
	}
}

export {
	connect,
	disconnect,
	socket
}