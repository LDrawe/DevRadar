import { useState, useEffect, FormEvent } from 'react';
import DevCard from './components/DevCard/DevCard';
import api from './services/api';
import DevProps from './types/Devs';
import { SelectedValueProps } from './types/Select';
import Select from 'react-select';
import options from './config/TechOptions';
import Dots from 'react-activity/dist/Dots';
import 'react-activity/dist/Dots.css';
import './styles/App.css';
import './styles/Global.css';
import './styles/SideBar.css';

export default function App() {

	const [devs, setDevs] = useState<DevProps[]>([]);

	const [loading, setLoading] = useState(false);

	const [github_username, setGithubUsername] = useState('');
	const [techs, setTechs] = useState<SelectedValueProps[]>([]);

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
			if (techs.length < 1) {
				setRequestError('Escolha pelo menos uma tecnologia!');
				return;
			}
			setLoading(true);
			if (requestError) {
				setRequestError('');
			}
			const { data } = await api.post('/devs', {
				github_username,
				techs: techs.map(tech => tech.value).join(', '),
				latitude,
				longitude
			});
			setGithubUsername('');
			setTechs([]);

			setDevs(oldValue => [...oldValue, data]);
		} catch (error: any) {
			if (error.response && error.response.data && error.response.data.error)
				setRequestError(error.response.data.error);
			else
				setRequestError("Houve um problema ao se conectar com o servidor. Tente novamente mais tarde.");
		}
		setLoading(false);
	}

	const handleChange = (selectedOption: any) => {
		setTechs(selectedOption);
	};

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
						<Select options={options} isMulti onChange={handleChange} />
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
						devs.map(dev => <DevCard key={dev.id} {...dev} />)
					}
				</ul>
			</main>
		</div>
	);
}
