import { celebrate, Segments, Joi } from 'celebrate';

export default {
    SearchDev: celebrate({
        [Segments.QUERY]: Joi.object().keys({
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            techs: Joi.string().required()
        })
    }),

    CreateDev: celebrate({
        [Segments.BODY]: Joi.object().keys({
            github_username: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            techs: Joi.array().items(Joi.string()).required()
        })
    }),

    DeleteDev: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            github_username: Joi.string().required(),
        })
    })
};