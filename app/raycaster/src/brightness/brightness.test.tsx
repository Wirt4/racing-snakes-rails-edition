import { expect, test, describe } from '@jest/globals';
import { Brightness } from './brightness';
describe("Brightness", () => {

	test("should calculate brightness correctly", () => {
		const maxDistance = 100;
		const brightness = new Brightness(maxDistance);

		expect(brightness.calculateBrightness(0)).toBe(100);
	});
})
