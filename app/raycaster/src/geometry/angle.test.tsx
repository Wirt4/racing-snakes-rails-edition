import { Angle } from './angle';
import { describe, test, expect } from '@jest/globals';

describe('Angle', () => {
	test('defaults to a measurement in radians', () => {
		const r = Math.PI / 2;
		expect(new Angle(r).radians).toEqual(r);
	});
	test('corrects for necative sweep', () => {
		const expected = Math.PI / 2;
		const input = -3 * Math.PI / 2;
		expect(new Angle(input).radians).toEqual(expected);
	})
})
