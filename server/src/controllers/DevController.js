import axios from 'axios';
import DevSchema from '../models/Dev';

export default {
	async index(request, response, next) {
		try {
			const devs = await DevSchema.find();
			return response.json(devs);
		} catch (error) {
			next(error);
		}
	},
	async create(request, response, next) {
		try {
			const { github_username, techs, latitude, longitude } = request.body;

			const devAlreadyExists = await DevSchema.findOne({ github_username: github_username.toLowerCase() });

			if (devAlreadyExists) {
				return response.status(403).json({ error: "Este desenvolvedor já está cadastrado" })
			}

			const { data } = await axios.get(`https://api.github.com/users/${github_username}`);

			if (!data) {
				return response.status(403).json({ error: "Nenhum desenvolvedor com este usuário foi encontrado" })
			}

			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			}

			const dev = await DevSchema.create({
				github_username,
				techs,
				location
			});
			return response.json(dev);
		} catch (error) {
			next(error);
		}
	},
	async delete(request, response, next) {
		try {
			const { github_username } = request.params;
			const dev = await DevSchema.findOneAndDelete({ github_username });
			if (!dev){
				return response.status(404).json({error: 'Nenhum dev com este usuário'});
			}
			return response.send();
		} catch (error) {
			next(error);
		}
	}
}