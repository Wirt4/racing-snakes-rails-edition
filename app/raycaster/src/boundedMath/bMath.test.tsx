import { describe, test, expect, afterEach } from '@jest/globals';
import { BMath } from './bmath';

function isRoundedToPlaces(num: number, places: number): boolean {
	const factor = Math.pow(10, places);
	return Math.round(num * factor) / factor === num;
}

describe('bMath.cos', () => {
	afterEach(() => {
		BMath._reset();
	});
	test('answer may not be longer than digits return the cosine of a number', () => {
		const bMath = BMath.getInstance(10)
		const result = bMath.cos(Math.PI / 7.5);
		expect(isRoundedToPlaces(result, 10)).toBe(true);
	})
	test('answer may not be longer than digits return the cosine of a number', () => {
		const bMath = BMath.getInstance(7)
		const result = bMath.cos(Math.PI / 7.5);
		const unbounded = Math.cos(Math.PI / 7.5);
		expect(Math.abs(result - unbounded)).toBeLessThan(1e-7);
	})
	test('returns the same value for the same input', () => {
		const bMath = BMath.getInstance(10);
		const result1 = bMath.cos(Math.PI / 7.5);
		const result2 = bMath.cos(Math.PI / 7.5);
		expect(result1).toEqual(result2);
	});
})

describe('bMath.sin', () => {
	afterEach(() => {
		BMath._reset();
	});

	test('answer may not be longer than digits return the sine of a number', () => {
		const bMath = BMath.getInstance(10)
		const result = bMath.sin(Math.PI / 7.5);
		expect(isRoundedToPlaces(result, 10)).toBe(true);
	})
	test('answer may not be longer than digits return the sine of a number', () => {
		const bMath = BMath.getInstance(7)
		const result = bMath.sin(Math.PI / 7.5);
		const unbounded = Math.sin(Math.PI / 7.5);
		expect(Math.abs(result - unbounded)).toBeLessThan(1e-7);
	})
	test('returns the same value for the same input', () => {
		const bMath = BMath.getInstance(10);
		const result1 = bMath.sin(Math.PI / 7.5);
		const result2 = bMath.sin(Math.PI / 7.5);
		expect(result1).toEqual(result2);
	});
	test('sin is not cos', () => {
		const bMath = BMath.getInstance(10);
		const result1 = bMath.sin(Math.PI / 7.5);
		const result2 = bMath.cos(Math.PI / 7.5);
		expect(result1).not.toEqual(result2);
	});
})

describe('BMath sqrt', () => {
	afterEach(() => {
		BMath._reset();
	});
	test('answer may not be longer than digits return the sine of a number', () => {
		const bMath = BMath.getInstance(10)
		const result = bMath.sqrt(2);
		expect(isRoundedToPlaces(result, 10)).toBe(true);
	})
	test('answer may not be longer than digits return the sine of a number', () => {
		const bMath = BMath.getInstance(7)
		const result = bMath.sqrt(2);
		const unbounded = Math.sqrt(2);
		expect(Math.abs(result - unbounded)).toBeLessThan(1e-7);
	})
	test('returns the same value for the same input', () => {
		const bMath = BMath.getInstance(10);
		const result1 = bMath.sqrt(2);
		const result2 = bMath.sqrt(2);
		expect(result1).toEqual(result2);
	});
});
