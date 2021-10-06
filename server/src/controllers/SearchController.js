import DevSchema from '../models/Dev';
import parseStringasArray from '../utils/parseStringasArray';

export default {
    async index(request, response, next) {
        try {
            const { latitude, longitude, techs, distance = 100000 } = request.query;
            const techsAsArray = parseStringasArray(techs);
            const devs = await DevSchema.find({
                techs: {
                    $in: techsAsArray,
                },
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: distance
                    }
                }
            });
            return response.json(devs);
        } catch (error) {
            next(error);
        }
    }
}