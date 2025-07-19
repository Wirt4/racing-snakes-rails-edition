import { describe, test, expect, jest } from '@jest/globals';
import { Player } from './player'
import { Coordinates, } from '../geometry/interfaces';
import { WallInterface } from '../gamemap/interface';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { ColorName } from '../color/color_name';
import { NINETY_DEGREES, TWO_HUNDRED_SEVENTY_DEGREES } from '../geometry/constants';

function areCoordsEqual(a: Coordinates, b: Coordinates): boolean {
	return a.x === b.x && a.y === b.y;
}

function isTrailContinuous(trail: WallInterface[]): boolean {
	for (let i = 0; i < trail.length - 1; i++) {
		if (!areCoordsEqual(trail[i].line.end, trail[i + 1].line.start)) {
			return false;
		}
	}
	return true;
}

class MockCamera implements CameraInterface {
	isRotating: boolean = false;
	adjust(): void { }
	beginTurnExecution(d: Directions): void { }
	angle: number = 0;
}

describe('Player.move())', () => {
	// 	test('given  a player is at coordinates 5, 5 with an angle of 0 and a speed of 5, when move is called, then the resulting coordinates are 10,5', () => {
	// 		const angle = 0;
	// 		const speed = 5;
	// 		const player = new Player({ x: 5, y: 5 }, angle, speed, ColorName.RED, new MockCamera());
	// 		player.move();
	// 		expect(player.x).toBe(10);
	// 		expect(player.y).toBe(5);
	// 	})
	test('given  a player is at coordinates 9, 10 with an angle of 3pi/2 and a speed of 7, when move is called, then the resulting coordinates are 9, 3', () => {
		const angle = TWO_HUNDRED_SEVENTY_DEGREES;
		const speed = 7;
		const player = new Player({ x: 9, y: 10 }, angle, speed, ColorName.RED, new MockCamera());
		player.move();
		expect(player.x).toBe(9);
		expect(player.y).toBe(3);
	})
	test('given  a player is at coordinates 9, 10 with an angle of pi/2 and a speed of 7, when move is called, then the resulting coordinates are 9, 24', () => {
		const angle = NINETY_DEGREES;
		const speed = 7;
		const player = new Player({ x: 9, y: 10 }, angle, speed, ColorName.RED, new MockCamera());
		player.move();
		expect(player.x).toBe(9);
		expect(player.y).toBe(17);
	})
})
describe('Player. turns', () => {
	test('given a player has a 0 degree heading, when the player.rotate is called with 90 degress is moved <turn interval> time, then the players angle is reset to 90 degress.', () => {
		const angle = 0
		const speed = 2
		const turnDistance = 11
		const camera = new MockCamera();
		const player = new Player({ x: 1, y: 1 }, angle, speed, ColorName.RED, camera)

		player.turnLeft()

		for (let i = 0; i < turnDistance; i += speed) {
			camera.angle = NINETY_DEGREES;
			player.move()
		}
		expect(player.angle).toBe(NINETY_DEGREES);
	})
	test('rotating a player by -90 degrees should change the angle from 0 to 3*Math.PI / 2', () => {
		const angle = 0
		const speed = 2
		const turnDistance = 40
		const camera = new MockCamera();
		const player = new Player({ x: 1, y: 1 }, angle, speed, ColorName.RED, camera);
		player.turnRight()
		for (let i = 0; i < turnDistance; i += speed) {
			camera.angle = TWO_HUNDRED_SEVENTY_DEGREES;
			player.move()
		}
		expect(player.angle).toEqual(TWO_HUNDRED_SEVENTY_DEGREES);
	})
})

describe('Player.move - trail continuity', () => {
	test('creates a continuous trail when moving straight', () => {
		const angle = 0; // facing right
		const speed = 1; // moving at speed 1
		const player = new Player({ x: 0, y: 0 }, angle, speed, ColorName.RED, new MockCamera());

		for (let i = 0; i < 10; i++) {
			player.move();
		}

		const trail = player.trail;
		expect(trail.length).toBe(1);
		expect(trail[0].line.start).toEqual({ x: 0, y: 0 });
		expect(trail[0].line.end).toEqual({ x: 10, y: 0 });
	});

	test('creates a continuous trail when turning right', () => {
		const angle = 0;
		const speed = 1;
		const player = new Player({ x: 0, y: 0 }, angle, speed, ColorName.RED, new MockCamera());
		// 4 frames to turn

		player.move(); // start forward
		player.turnRight();

		for (let i = 0; i < 4; i++) {
			player.move(); // during turn
		}

		for (let i = 0; i < 5; i++) {
			player.move(); // after turn
		}

		const trail = player.trail;
		expect(trail.length).toBeGreaterThan(1);
		expect(isTrailContinuous(trail)).toBe(true);
	});

	test('creates a continuous trail with multiple turns', () => {
		const angle = 0;
		const speed = 1;
		const camera = new MockCamera();
		camera.isRotating = false; // Ensure camera is not rotating
		const player = new Player({ x: 0, y: 0 }, angle, speed, ColorName.RED, camera);

		player.move();
		player.turnRight();
		for (let i = 0; i < 4; i++) player.move();
		for (let i = 0; i < 3; i++) player.move();
		player.turnLeft();
		for (let i = 0; i < 4; i++) player.move();
		for (let i = 0; i < 3; i++) player.move();

		const trail = player.trail;
		expect(trail.length).toBeGreaterThan(2);
		expect(isTrailContinuous(trail)).toBe(true);
	});
});

