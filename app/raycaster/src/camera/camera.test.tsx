import { describe, test, expect, beforeEach } from '@jest/globals';
import { Camera } from './camera';
import { Directions } from '../controls/directions';
import { NINETY_DEGREES, TWO_HUNDRED_SEVENTY_DEGREES, FULL_CIRCLE } from '../geometry/constants';

describe('isRotating tests', () => {
	const turnFrames = 15;
	let camera: Camera;
	beforeEach(() => {
		camera = new Camera(turnFrames, 0);
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
		for (let i = 0; i < turnFrames; i++) {
			expect(camera.isRotating).toBe(true);
			camera.adjust();
		}
		expect(camera.isRotating).toBe(false);
	});
	test('after rotation has completed, the camera angle is now facing in the new direction', () => {
		camera.beginTurnExecution(Directions.LEFT);
		for (let i = 0; i < turnFrames; i++) {
			camera.adjust();
		}
		expect(camera.angle).toBe(NINETY_DEGREES);
	});
	test('after rotation has completed, the camera angle is now facing in the new direction', () => {
		camera.beginTurnExecution(Directions.RIGHT);
		for (let i = 0; i < turnFrames; i++) {
			camera.adjust();
		}
		expect(camera.angle).toBe(TWO_HUNDRED_SEVENTY_DEGREES);
	});

	test('the sweep of the move should inbetween', () => {
		camera.beginTurnExecution(Directions.RIGHT);
		for (let i = 0; i < turnFrames; i++) {
			camera.adjust();
			expect(camera.angle).toBeGreaterThan(TWO_HUNDRED_SEVENTY_DEGREES);
			expect(camera.angle).toBeLessThan(FULL_CIRCLE);
		}
		expect(camera.angle).toBe(TWO_HUNDRED_SEVENTY_DEGREES);
	});


});
