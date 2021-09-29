import { useState, useEffect, FormEvent } from 'react';
import DevCard from './components/DevCard/DevCard';
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

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position => {
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
				techs: techs.split(',').map(tech => tech.trim()),
				latitude,
				longitude
			});
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
								type="number"
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
								type="number"
								value={longitude}
								onChange={e => setLatitude(Number(e.target.value))}
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
						devs.map(dev => <DevCard key={`${dev.id}`} {...dev} />)
					}
				</ul>
			</main>
		</div>
	);
}
