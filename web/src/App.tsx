import { useState, useEffect, FormEvent } from 'react';
import DevCard from './components/DevCard/DevCard';
import { disconnect, connect, socket } from './services/socket';
import api from './services/api';
import DevProps from './types/Devs';
import Dots from 'react-activity/dist/Dots';
import 'react-activity/dist/Dots.css';
import './styles/App.css';
import './styles/Global.css';
import './styles/SideBar.css';

export default function App() {

	const [devs, setDevs] = useState<DevProps[]>([]);

	const [loading, setLoading] = useState(false);

	const [github_username, setGithubUsername] = useState('');
	const [techs, setTechs] = useState('');

	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);

	const [requestError, setRequestError] = useState('');

	const loadDevs = async () => {
		const { data } = await api.get('/devs');
		setDevs(data);
	}

	const handleAddDev = async (e: FormEvent) => {
		try {
			e.preventDefault();
			setLoading(true);
			if (requestError) {
				setRequestError('');
			}
			const { data } = await api.post('/devs', {
				github_username,
				techs,
				latitude,
				longitude
			});
			disconnect();
			connect(latitude.toString(), longitude.toString(), techs);
			setGithubUsername('');
			setTechs('');
			setDevs(oldValue => [...oldValue, data]);
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error)
				setRequestError(error.response.data.error);
			else
				setRequestError("Houve um problema ao se conectar com o servidor. Tente novamente mais tarde.");
		}
		setLoading(false);
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position => {
				console.log(typeof (position.coords.latitude));
				setLatitude(position.coords.latitude);
				setLongitude(position.coords.longitude);
			},
			error => console.log(error),
			{
				timeout: 30000
			}
		);
	}, []);

	useEffect(() => {
		loadDevs();
	}, []);

	useEffect(() => {
		socket.on('dev-deleted', dev => setDevs(oldValue => oldValue.filter(oldDev => oldDev.github_username !== dev.github_username)));
		return () => {
			socket.off();
		}
	}, [devs]);

	return (
		<div id="App">
			<aside>
				<strong>
					Cadastrar
				</strong>
				<form onSubmit={handleAddDev}>
					<div className="input-block">
						<label htmlFor="github_username">
							Usuário do GitHub
						</label>
						<input
							name="github_username"
							id="github_username"
							value={github_username}
							onChange={e => setGithubUsername(e.target.value)}
							required
						/>
					</div>
					<div className="input-block">
						<label htmlFor="techs">
							Tecnologias
						</label>
						<input
							name="techs"
							id="techs"
							value={techs}
							onChange={e => setTechs(e.target.value)}
							required
						/>
					</div>
					<div className="input-group">
						<div className="input-block">
							<label htmlFor="latitude">
								Latitude
							</label>
							<input
								name="latitude"
								id="latitude"
								value={latitude}
								onChange={e => setLatitude(Number(e.target.value))}
								required
							/>
						</div>
						<div className="input-block">
							<label htmlFor="longitude">
								Longitude
							</label>
							<input
								name="longitude"
								id="longitude"
								value={longitude}
								onChange={e => setLongitude(Number(e.target.value))}
								required
							/>
						</div>
					</div>
					<button type="submit">
						{loading ? <Dots /> : "Salvar"}
					</button>
				</form>
				{
					requestError ?
						<p>{requestError}</p>
						:
						null
				}
			</aside>

			<main>
				<ul>
					{
						devs.map(dev => <DevCard key={dev.id} {...dev} />)
					}
				</ul>
			</main>
		</div>
	);
}
