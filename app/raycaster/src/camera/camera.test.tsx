import { describe, test, expect } from '@jest/globals';
import { Camera } from './camera';
import { Directions } from '../controls/directions';

describe('isRotating tests', () => {
	test('camera is not rotating  when created', () => {
		const camera = new Camera();
		expect(camera.isRotating).toBe(false);
	});
	test('given the camera is instantiated with a turn time of 15 frames, after beginTurnExecution is called, then its state is rotation', () => {
		const camera = new Camera();
		camera.beginTurnExecution(Directions.LEFT);
		expect(camera.isRotating).toBe(true);
	});
});
