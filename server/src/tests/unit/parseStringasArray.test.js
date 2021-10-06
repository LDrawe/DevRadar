import crypto from 'crypto';
import parseStringasArray from '../../utils/parseStringasArray';

describe('Parse String as Array', () => {
    it('Should return an array from a string', () => {
        const randomString = crypto.randomBytes(5).toString('HEX');
        expect(typeof randomString).toBe('string');
        expect(randomString).toHaveLength(10);
        const stringAsArray = parseStringasArray(randomString);

        expect(Array.isArray(stringAsArray)).toBe(true);
    });
});