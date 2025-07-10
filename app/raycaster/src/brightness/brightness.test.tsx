import { expect, test, describe } from '@jest/globals';
import { Brightness } from './brightness';
describe("Brightness", () => {

	test("should calculate brightness correctly", () => {
		const maxDistance = 100;
		const brightness = new Brightness(maxDistance);

		expect(brightness.calculateBrightness(0)).toBe(100);
	});
	test("should return 0 brightness for distance greater than maxDistance", () => {
		const maxDistance = 100;
		const brightness = new Brightness(maxDistance);

		expect(brightness.calculateBrightness(150)).toBe(0);
	});
	test("brightness should cap at the max value set", () => {
		const maxDistance = 100;

		const brightness = new Brightness(maxDistance, 60);

		expect(brightness.calculateBrightness(0)).toBe(60);
	});
})
