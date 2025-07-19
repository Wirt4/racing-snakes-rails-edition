import { describe, test, expect } from '@jest/globals';
import { HSL } from './hsl';
describe('HSL object tests', () => {
	test('object creation', () => {
		const hsl = new HSL(240, 0.57, 1.0);
		expect(hsl.hue).toEqual(240);
		expect(hsl.lightness).toEqual(1.0);
	})
	test('clamps to 256 colors', () => {
		const hsl = new HSL(240.5, 0.57, 1.0);
		expect(hsl.hue).toEqual(240);
	})
	test('enforce validity of hue', () => {
		expect(() => new HSL(-10, 100, 100)).toThrow("Hue must be between 0 and 360");
		expect(() => new HSL(370, 100, 100)).toThrow("Hue must be between 0 and 360");
		expect(() => new HSL(360, 100, 100)).not.toThrow();
		expect(() => new HSL(0, 100, 100)).not.toThrow();
	})
	test('enforce validity of saturation', () => {
		expect(() => new HSL(240, -10, 1)).toThrow("Saturation must be between 0 and 100");
		expect(() => new HSL(240, 110, 1)).toThrow("Saturation must be between 0 and 100");
		expect(() => new HSL(240, 1, 1)).not.toThrow();
		expect(() => new HSL(240, 0, 1)).not.toThrow();
	})
	test('enforce validity of lightness', () => {
		expect(() => new HSL(240, 1, -10)).toThrow("Lightness must be between 0 and 100");
		expect(() => new HSL(240, 1, 110)).toThrow("Lightness must be between 0 and 100");
		expect(() => new HSL(240, 1, 1)).not.toThrow();
		expect(() => new HSL(240, 0, 0)).not.toThrow();
	})
	test('HSL to hex conversion', () => {
		const hsl = new HSL(0, 1, 0.5);
		const hex = hsl.toHex();
		expect(hex).toEqual("#FF0000");
	})
	test("object's lightness is mutable", () => {
		const hsl = new HSL(120, 1, 0.5);
		const hex = hsl.toHex();
		expect(hex).toEqual("#00FF00");
		hsl.lightness = 0.75;
		const lighterHex = hsl.toHex();
		expect(lighterHex).toEqual("#80FF80");
		hsl.lightness = 0.25;
		const darkerHex = hsl.toHex();
		expect(darkerHex).toEqual("#008000");
	})

})
