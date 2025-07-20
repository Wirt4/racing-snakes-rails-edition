import { describe, test, expect, jest } from '@jest/globals';
import { Player } from './player'
import { Coordinates, } from '../geometry/interfaces';
import { WallInterface } from '../gamemap/interface';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { ColorName } from '../color/color_name';
import { TrailInterface } from '../trail/interface';
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
class MockTrail implements TrailInterface {
	head: { x: number, y: number } = { x: 0, y: 0 };
	tail: { x: number, y: number } = { x: 0, y: 0 };
	color: ColorName = ColorName.RED;
	append(x: number, y: number): void { }
}
//describe('Player.move())', () => {
// 	test('given  a player is at coordinates 5, 5 with an angle of 0 and a speed of 5, when move is called, then the resulting coordinates are 10,5', () => {
// 		const speed = 5;
// 		const camera = new MockCamera();
// 		camera.angle = 0;
// 		const player = new Player({ x: 5, y: 5 }, speed, ColorName.RED, camera, new MockTrail());
// 		player.move();
// 		expect(player.x).toBe(10);
// 		expect(player.y).toBe(5);
// 	})
// 	test('given  a player is at coordinates 9, 10 with an angle of 3pi/2 and a speed of 7, when move is called, then the resulting coordinates are 9, 3', () => {
// 		const speed = 7;
// 		const camera = new MockCamera();
// 		camera.angle = TWO_HUNDRED_SEVENTY_DEGREES;
// 		const player = new Player({ x: 9, y: 10 }, speed, ColorName.RED, camera, new MockTrail());
// 		player.move();
// 		expect(player.x).toBe(9);
// 		expect(player.y).toBe(3);
// 	})
// 	test('given  a player is at coordinates 9, 10 with an angle of pi/2 and a speed of 7, when move is called, then the resulting coordinates are 9, 24', () => {
// 		const speed = 7;
// 		const camera = new MockCamera();
// 		camera.angle = Math.PI / 2;
// 		const player = new Player({ x: 9, y: 10 }, speed, ColorName.RED, camera, new MockTrail());
// 		player.move();
// 		expect(player.x).toBe(9);
// 		expect(player.y).toBe(17);
// 	})
// })
// describe('Player. turns', () => {
// 	test('given a player has a 0 degree heading, when the player.rotate is called with 90 degress is moved <turn interval> time, then the players angle is reset to 90 degress.', () => {
// 		const speed = 2
// 		const turnDistance = 11
// 		const camera = new MockCamera();
// 		const player = new Player({ x: 1, y: 1 }, speed, ColorName.RED, camera, new MockTrail());
//
// 		player.turnLeft()
//
// 		for (let i = 0; i < turnDistance; i += speed) {
// 			camera.angle = NINETY_DEGREES;
// 			player.move()
// 		}
// 		expect(player.angle).toBe(NINETY_DEGREES);
// 	})
// 	test('rotating a player by -90 degrees should change the angle from 0 to 3*Math.PI / 2', () => {
// 		const speed = 2
// 		const turnDistance = 40
// 		const camera = new MockCamera();
// 		const player = new Player({ x: 1, y: 1 }, speed, ColorName.RED, camera, new MockTrail());
// 		player.turnRight()
// 		for (let i = 0; i < turnDistance; i += speed) {
// 			camera.angle = TWO_HUNDRED_SEVENTY_DEGREES;
// 			player.move()
// 		}
// 		expect(player.angle).toEqual(TWO_HUNDRED_SEVENTY_DEGREES);
// 	})
// })
//
describe('Player.move - trail continuity', () => {
	// test('creates a continuous trail when moving straight', () => {
	// 	const speed = 1;
	// 	const player = new Player({ x: 0, y: 0 }, speed, ColorName.RED, new MockCamera(), new MockTrail());
	//
	// 	for (let i = 0; i < 10; i++) {
	// 		player.move();
	// 	}
	//
	// 	const trail = player.temp;
	// 	expect(trail.length).toBe(1);
	// 	expect(trail[0].line.start).toEqual({ x: 0, y: 0 });
	// 	expect(trail[0].line.end).toEqual({ x: 10, y: 0 });
	// });
	//
	// test('creates a continuous trail when turning right', () => {
	// 	const speed = 1;
	// 	const player = new Player({ x: 0, y: 0 }, speed, ColorName.RED, new MockCamera(), new MockTrail());
	//
	// 	player.move();
	// 	player.turnRight();
	//
	// 	for (let i = 0; i < 4; i++) {
	// 		player.move();
	// 	}
	//
	// 	for (let i = 0; i < 5; i++) {
	// 		player.move();
	// 	}
	//
	// 	const trail = player.temp;
	// 	expect(isTrailContinuous(trail)).toBe(true);
	// });
	//
	test('Adds points to the trail at turns', () => {
		const speed = 1;
		const camera = new MockCamera();
		camera.isRotating = false;
		const trail = new MockTrail();
		jest.spyOn(trail, 'append').mockImplementation(() => { });
		const player = new Player({ x: 0, y: 0 }, speed, ColorName.RED, camera, trail);

		player.turnRight();
		camera.angle = TWO_HUNDRED_SEVENTY_DEGREES;
		player.move();
		expect(trail.append).toHaveBeenCalledWith(0, 0);
		player.move();
		expect(trail.append).not.toHaveBeenCalled();
		// for (let i = 0; i < 4; i++) {
		// 	player.move();
		// }
		// player.turnLeft();
		// camera.angle = 0;
		// player.move();
		// expect(trail.append).toHaveBeenCalledWith(0, -4);
	});
});

