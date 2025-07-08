import { describe, test, expect } from '@jest/globals';
import { Raycaster } from './raycaster';
describe('Raycaster tests', () => {

	test('getViewRays should throw error if not implemented', () => {
		const raycaster = new Raycaster(640, Math.PI / 3);
		const expectedRayNumber = 640;
		const actualRayNumber = raycaster.getViewRays(0).size;
		expect(actualRayNumber).toEqual(expectedRayNumber);
	});
	test('no ray in result may exist outside the cone of vision', () => {
		const raycaster = new Raycaster(640, Math.PI / 2); // 90 degrees field of view
		const rays = raycaster.getViewRays(Math.PI / 2); //looking straight up
		rays.forEach(ray => {
			expect(ray).toBeGreaterThanOrEqual(Math.PI / 4);
			expect(ray).toBeLessThanOrEqual(3 * Math.PI / 4);
		});
	});
	test('object may not be instantiaed with invalid resolutions', () => {
		expect(() => {
			new Raycaster(8.98, Math.PI / 3);
		}).toThrow();
		expect(() => {
			new Raycaster(-1, Math.PI / 3);
		}).toThrow();
	});
});
