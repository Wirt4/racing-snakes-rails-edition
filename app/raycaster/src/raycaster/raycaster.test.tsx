import { describe, test, expect } from '@jest/globals';
import { Raycaster } from './raycaster';
describe('Raycaster tests', () => {

	test('getViewRays should return a set with one ray per point of resolution', () => {
		const raycaster = new Raycaster(640, Math.PI / 3);
		const expectedRayNumber = 640;
		const actualRayNumber = raycaster.getViewRays(0).size;
		expect(actualRayNumber).toEqual(expectedRayNumber);
	});
	test('getViewRays should return rays in the range of 0 to 2*PI', () => {
		const raycaster = new Raycaster(640, Math.PI / 3);
		const rays = raycaster.getViewRays(0);
		rays.forEach(ray => {
			expect(ray).toBeGreaterThanOrEqual(0);
			expect(ray).toBeLessThanOrEqual(2 * Math.PI);
		});
	})
	test('no ray in result may exist outside the cone of vision: happy path', () => {
		const raycaster = new Raycaster(640, Math.PI / 2); // 90 degrees field of view
		const rays = raycaster.getViewRays(Math.PI / 2); //looking straight up
		rays.forEach(ray => {
			expect(ray).toBeGreaterThanOrEqual(Math.PI / 4);
			expect(ray).toBeLessThanOrEqual(3 * Math.PI / 4);
		});
	});
	test('object may not be instantiated with invalid resolutions', () => {
		expect(() => {
			new Raycaster(8.98, Math.PI / 3);
		}).toThrow();
		expect(() => {
			new Raycaster(-1, Math.PI / 3);
		}).toThrow();
	});
	test('no ray in result may exist outside the cone of vision: straddles origin', () => {
		const raycaster = new Raycaster(640, Math.PI / 2); // 90 degrees field of view
		const rays = raycaster.getViewRays(0); //looking straight to the right
		rays.forEach(ray => {
			expect((ray <= Math.PI / 4 && ray >= 0) || (ray <= 2 * Math.PI && ray >= 7 * Math.PI / 4)).toEqual(true);
		});
	});

	test('object may not be instantiated with invalid angle for field of view', () => {
		expect(() => {
			new Raycaster(640, -1);
		}).toThrow();
		expect(() => {
			new Raycaster(640, 2 * Math.PI + 0.01);
		}).toThrow();
	});
});
