import { describe, test, expect, beforeEach } from '@jest/globals';
import { Camera } from './camera';
import { Directions } from '../controls/directions';
import { NINETY_DEGREES } from '../geometry/constants';

describe('isRotating tests', () => {
	let camera: Camera;
	beforeEach(() => {
		camera = new Camera(15, 0);
	});
	test('camera is not rotating  when created', () => {
		expect(camera.isRotating).toBe(false);
	});
	test('given the camera is instantiated with a turn time of 15 frames, after beginTurnExecution is called, then its state is rotation', () => {
		camera.beginTurnExecution(Directions.LEFT);
		expect(camera.isRotating).toBe(true);
	});
	test('given the camera is instantiated with a turn time of 15 frames, after 15 adjustments, then rotating is false again', () => {
		camera.beginTurnExecution(Directions.RIGHT);
		for (let i = 0; i < 15; i++) {
			expect(camera.isRotating).toBe(true);
			camera.adjust();
		}
		expect(camera.isRotating).toBe(false);
	});
	test('after rotation has completed, the camera angle is now facing in the new direction', () => {
		camera.beginTurnExecution(Directions.LEFT);
		for (let i = 0; i < 15; i++) {
			camera.adjust();
		}
		expect(camera.angle).toBe(NINETY_DEGREES);
	});
});
