import { describe, test, expect, beforeEach } from '@jest/globals';
import { SIXTY_DEGREES, FULL_CIRCLE, NINETY_DEGREES, FORTY_FIVE_DEGREES } from '../geometry/constants';
import { Raycaster } from './raycaster';
const TEST_WIDTH = 440;
const TEST_HEIGHT = 680;
const TEST_RESOLUTION = 640;
const TEST_DISTANCE = 1000;
const TEST_HORIZON_Y = 340;
const TEST_WALL_HEIGHT = 100;
const TEST_CAMERA_HEIGHT = 90;


describe('Raycaster instantiation', () => {
	test('object may not be instantiated with invalid resolutions', () => {
		expect(() => {
			new Raycaster(
				8.98,
				SIXTY_DEGREES,
				TEST_WIDTH,
				TEST_HEIGHT,
				TEST_DISTANCE,
				TEST_HORIZON_Y,
				TEST_WALL_HEIGHT,
				TEST_CAMERA_HEIGHT
			);
		}).toThrow();
		expect(() => {
			new Raycaster(-1,
				SIXTY_DEGREES,
				TEST_WIDTH,
				TEST_HEIGHT,
				TEST_DISTANCE,
				TEST_HORIZON_Y,
				TEST_WALL_HEIGHT,
				TEST_CAMERA_HEIGHT);
		}).toThrow();
	});
	test('object may not be instantiated with invalid angle for field of view', () => {
		expect(() => {
			new Raycaster(TEST_RESOLUTION, -1,
				TEST_WIDTH,
				TEST_HEIGHT,
				TEST_DISTANCE,
				TEST_HORIZON_Y,
				TEST_WALL_HEIGHT,
				TEST_CAMERA_HEIGHT);
		}).toThrow();
		expect(() => {
			new Raycaster(TEST_RESOLUTION, FULL_CIRCLE + 0.01,
				TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE,
				TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT
			);
		}).toThrow();
	});
});
describe('getViewRays tests', () => {

	test('getViewRays should return a set with one ray per point of resolution', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION,
			SIXTY_DEGREES, TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE,
			TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
		const expectedRayNumber = TEST_RESOLUTION;
		const actualRayNumber = raycaster.getViewRays(0).length;
		expect(actualRayNumber).toEqual(expectedRayNumber);
	});
	test('getViewRays should return rays in the range of 0 to 2*PI', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION, SIXTY_DEGREES,
			TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE, TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
		const rays = raycaster.getViewRays(0);
		rays.forEach(ray => {
			expect(ray).toBeGreaterThanOrEqual(0);
			expect(ray).toBeLessThanOrEqual(FULL_CIRCLE);
		});
	});
	test('getViewRays should return rays in order', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION, NINETY_DEGREES,
			TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE, TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
		const rays = raycaster.getViewRays(FORTY_FIVE_DEGREES);
		expect(Math.abs(rays[0] - NINETY_DEGREES)).toBeLessThan(0.00001);
	});
	test('no ray in result may exist outside the cone of vision: happy path', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION,
			NINETY_DEGREES, TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE, TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT
		); // 90 degrees field of view
		const rays = raycaster.getViewRays(NINETY_DEGREES); //looking straight up
		rays.forEach(ray => {
			expect(ray).toBeGreaterThanOrEqual(FORTY_FIVE_DEGREES);
			expect(ray).toBeLessThanOrEqual(3 * FORTY_FIVE_DEGREES);
		});
	});
	test('no ray in result may exist outside the cone of vision: straddles origin', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION, NINETY_DEGREES,
			TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE, TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT); // 90 degrees field of view
		const rays = raycaster.getViewRays(0); //looking straight to the right
		rays.forEach(ray => {
			expect((ray <= FORTY_FIVE_DEGREES && ray >= 0) || (ray <= FULL_CIRCLE && ray >= 7 * FORTY_FIVE_DEGREES)).toEqual(true);
		});
	});
});

describe('RemoveFishEye', () => {
	let raycaster: Raycaster;
	beforeEach(() => {
		raycaster = new Raycaster(TEST_RESOLUTION, SIXTY_DEGREES,
			TEST_WIDTH, TEST_HEIGHT, TEST_DISTANCE, TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
	})
	test('removeFishEye should return the same distance when angle is 0', () => {
		const distance = 10;
		const rayAngle = 0;
		const centerAngle = 0;
		const result = raycaster.removeFishEye(distance, centerAngle, rayAngle);
		expect(result).toEqual(distance);
	});
	test('removeFishEye should return the shorter and shorter distances the farther the ray is from the center', () => {
		const distance = 10;
		const centerAngle = SIXTY_DEGREES;
		const correctedDistances = [];
		for (let rayAngle = centerAngle; rayAngle <= FORTY_FIVE_DEGREES + centerAngle; rayAngle += FORTY_FIVE_DEGREES / 5) {
			const result = raycaster.removeFishEye(distance, centerAngle, rayAngle);
			correctedDistances.push(result);
		}
		for (let i = 1; i < correctedDistances.length; i++) {
			expect(correctedDistances[i] < correctedDistances[i - 1]).toEqual(true);
		}

	});
	test('removeFishEye should not apply to wide angles', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION,
			SIXTY_DEGREES * 2, TEST_WIDTH,
			TEST_HEIGHT, TEST_DISTANCE, TEST_HORIZON_Y,
			TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
		const distance = 10;
		const rayAngle = SIXTY_DEGREES;
		const centerAngle = 0;
		const result = raycaster.removeFishEye(distance, centerAngle, rayAngle);
		expect(result).toEqual(distance);
	})
})
describe('wallHeightToSliceHeight', () => {
	test('wallHeightToSliceHeight should fill the screen when distance is 0', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION,
			SIXTY_DEGREES, TEST_WIDTH, TEST_HEIGHT,
			TEST_DISTANCE, TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
		const height = 10;
		const distance = 0;
		const result = raycaster.wallHeightToSliceHeight(distance, height);
		expect(result).toEqual(TEST_HEIGHT);
	});
	test('arguments must be positive', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION,
			SIXTY_DEGREES, TEST_WIDTH, TEST_HEIGHT,
			TEST_DISTANCE, TEST_HORIZON_Y,
			TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT);
		expect(() => {
			raycaster.wallHeightToSliceHeight(-1, 10);
		}).toThrow();
		expect(() => {
			raycaster.wallHeightToSliceHeight(10, -1);
		}).toThrow();
	});
	test('wallHeightToSliceHeight should return the height when distance is positive', () => {
		const raycaster = new Raycaster(TEST_RESOLUTION,
			NINETY_DEGREES, 640, TEST_HEIGHT, TEST_DISTANCE,
			TEST_HORIZON_Y, TEST_WALL_HEIGHT, TEST_CAMERA_HEIGHT); //control for a focal length
		const height = 10;
		const distance = 5;
		const expected = 6023.529411764706;
		const result = raycaster.wallHeightToSliceHeight(distance, height);
		expect(Math.abs(result - expected)).toBeLessThan(1e-5);
	});
});
