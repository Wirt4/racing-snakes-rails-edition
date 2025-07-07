import { Angle } from './angle';
import { describe, test, expect } from '@jest/globals';

describe('Angle', () => {
	test('defaults to a measurement in radians', () => {
		const r = Math.PI / 2;
		expect(new Angle(r).radians).toEqual(r);
	});
	test('corrects for negative sweep', () => {
		const expected = Math.PI / 2;
		const input = -3 * Math.PI / 2;
		expect(new Angle(input).radians).toEqual(expected);
	})
	test('corrects for over positive sweep', () => {
		const expected = Math.PI / 2;
		const input = 5 * Math.PI / 2;
		expect(new Angle(input).radians).toEqual(expected);
	})
	test('can convert to degrees', () => {
		const expected = 90;
		const input = Math.PI / 2;
		expect(new Angle(input).degrees).toEqual(expected);

	})
})
