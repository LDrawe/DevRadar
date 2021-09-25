import DevSchema from '../models/Dev';

export default {
    async index(request, response, next) {
        const { latitude, longitude, techs } = request.query;
        const techsArray = techs.split(',').map(tech => tech.trim());
        const devs = await DevSchema.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000
                }
            }
        });
        return response.json(devs);
    }
}