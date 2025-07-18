import { describe, test, expect, beforeEach } from '@jest/globals';
import { Camera } from './camera';
import { Directions } from '../controls/directions';

describe('isRotating tests', () => {
	let camera: Camera;
	beforeEach(() => {
		camera = new Camera();
	});
	test('camera is not rotating  when created', () => {
		expect(camera.isRotating).toBe(false);
	});
	test('given the camera is instantiated with a turn time of 15 frames, after beginTurnExecution is called, then its state is rotation', () => {
		camera.beginTurnExecution(Directions.LEFT);
		expect(camera.isRotating).toBe(true);
	});
});
