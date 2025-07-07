import { describe, test, expect } from '@jest/globals';
import { HSL } from './hsl';
describe('HSL object tests', () => {
	test('object creation', () => {
		const hsl = new HSL(240.5);
		expect(hsl.hue).toEqual(240.5);
	})
	test('enforce validity of hue', () => {
		expect(() => new HSL(-10)).toThrow("Hue must be between 0 and 360");
		expect(() => new HSL(370)).toThrow("Hue must be between 0 and 360");
		expect(() => new HSL(360)).not.toThrow();
		expect(() => new HSL(0)).not.toThrow();
	})

})
