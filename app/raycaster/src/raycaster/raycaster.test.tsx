import { describe, test, expect } from '@jest/globals';
import { Raycaster } from './raycaster';
describe('Raycaster tests', () => {

	test('getViewRays should throw error if not implemented', () => {
		const raycaster = new Raycaster(640);
		const expectedRayNumber = 640;
		const actualRayNumber = raycaster.getViewRays(0).length;
		expect(actualRayNumber).toEqual(expectedRayNumber);
	});
});
