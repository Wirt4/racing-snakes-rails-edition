import { describe, test, expect } from '@jest/globals';
import { Camera } from './camera';
describe('isRotating tests', () => {
	test('camera is not rotating  when created', () => {
		const camera = new Camera();
		expect(camera.isRotating).toBe(false);
	});
});
