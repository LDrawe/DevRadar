import axios from 'axios';
import DevSchema from '../models/Dev';

export default {
	async index(request, response, next){
		const devs = await DevSchema.find();
		return response.json(devs);
	},
	async create(request, response, next) {
		try {
			const { github_username, techs, latitude, longitude } = request.body;
			const devAlreadyExists = await DevSchema.findOne({ github_username });
			if (devAlreadyExists) {
				return response.status(403).json({ error: "Este desenvolvedor já está cadastrado" })
			}
			const { data } = await axios.get(`https://api.github.com/users/${github_username}`);
			const { name = login, avatar_url, bio } = data;
			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			}

			const dev = await DevSchema.create({
				github_username,
				name,
				avatar_url,
				bio,
				techs,
				location
			});
			return response.json(dev);
		} catch (error) {
			next(error);
		}
	}
}