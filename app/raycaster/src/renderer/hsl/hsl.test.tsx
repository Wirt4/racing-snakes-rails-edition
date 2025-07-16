import { describe, test, expect } from '@jest/globals';
import { HSL } from './hsl';
describe('HSL object tests', () => {
	test('object creation', () => {
		const hsl = new HSL(240.5, 57, 100);
		expect(hsl.hue).toEqual(240.5);
		expect(hsl.saturation).toEqual(57);
		expect(hsl.lightness).toEqual(100);
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
		const hsl = new HSL(0, 100, 50); //Red
		const hex = hsl.toHex();
		expect(hex).toEqual('#FF0000');
	})
	test('confirm objects lightness is mutable', () => {
		const hsl = new HSL(120, 100, 50); //Green
		const hex = hsl.toHex();
		expect(hex).toEqual('#00FF00');
		hsl.lightness = 75; //Change lightness
		const newHex = hsl.toHex();
		expect(newHex).toEqual('#80FF80'); //Expect a lighter green
		hsl.lightness = 25; //Change lightness
		const darkerHex = hsl.toHex();
		expect(darkerHex).toEqual('#008000'); //Expect a darker green
	})

})
