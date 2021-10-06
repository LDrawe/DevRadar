require('dotenv').config();
import request from 'supertest';
import Dev from '../../models/Dev';
import app from '../../app';
import { disconnect } from 'mongoose';

describe('Dev', () => {

    beforeAll(async () => {
        await Dev.deleteMany();
    });

    it('should be able to create a new dev', async () => {
        const response = await request(app).post('/devs').send({
            github_username: 'maykbrito',
            techs: ['ReactJS', 'NodeJS', 'Elixir'],
            latitude: -42.3671209,
            longitude: -21.1270505
        });
        const dev = await Dev.findOne({ github_username: 'maykbrito' });

        expect(typeof dev).toBe('object');
        expect(dev).toHaveProperty('_id');

        expect(response).toHaveProperty('status');
        expect(typeof response.status).toBe('number');
        expect(response.status).toBe(201);
    });

    it('should be able to list devs', async () => {
        const response = await request(app).get('/devs').send();

        expect(response).toHaveProperty('status');
        expect(typeof response.status).toBe('number');
        expect(response.status).toBe(200);
    });

    it('should be able to search for a dev', async () => {
        const response = await request(app).get('/devs/search').query({
            latitude: -20.2667717,
            longitude: -42.0469533,
            techs: 'NodeJS'
        });

        expect(response).toHaveProperty('status');
        expect(response).toHaveProperty('body');

        expect(typeof response.status).toBe('number');
        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should be able to delete a dev', async () => {
        const response = await request(app).delete('/devs/maykbrito').send();
        
        expect(response).toHaveProperty('status');
        expect(typeof response.status).toBe('number');
        expect(response.status).toBe(200);
    });

    afterAll(async () => await disconnect());
});