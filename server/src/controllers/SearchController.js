import DevSchema from '../models/Dev';

export default {
    async index(request, response, next) {
        try {
            const { latitude, longitude, techs, distance = 10000 } = request.query;
            const devs = await DevSchema.find({
                techs: {
                    $in: techs,
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