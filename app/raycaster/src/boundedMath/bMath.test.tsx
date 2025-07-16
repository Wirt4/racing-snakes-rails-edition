import { BMath } from './bMath'
import { describe, test, expect, } from '@jest/globals';

function isRoundedToPlaces(num: number, places: number): boolean {
	const factor = Math.pow(10, places);
	return Math.round(num * factor) / factor === num;
}

describe('bMath.cos', () => {
	test('answer may not be longer than digits return the cosine of a number', () => {
		const bMath = new BMath(10)
		const result = bMath.cos(Math.PI / 7.5);
		expect(isRoundedToPlaces(result, 10)).toBe(true);
	})
	test('answer may not be longer than digits return the cosine of a number', () => {
		const bMath = new BMath(7)
		const result = bMath.cos(Math.PI / 7.5);
		const unbounded = Math.cos(Math.PI / 7.5);
		expect(Math.abs(result - unbounded)).toBeLessThan(1e-7);
	})

})
