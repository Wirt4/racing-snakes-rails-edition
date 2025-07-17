import { describe, test, expect, } from '@jest/globals';
import { Player } from './player';
// function areCoordsEqual(a: Coordinates, b: Coordinates): boolean {
// 	return a.x === b.x && a.y === b.y;
// }
//
// function isTrailContinuous(trail: LineSegment[]): boolean {
// 	for (let i = 0; i < trail.length - 1; i++) {
// 		if (!areCoordsEqual(trail[i].end, trail[i + 1].start)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }
// describe('Player.move())', () => {
// 	test('given  a player is at coordinates 5, 5 with an angle of 0 and a speed of 5, when move is called, then the resulting coordinates are 10,5', () => {
// 		const player = new Player({ x: 5, y: 5 }, 0, 5, 1);
// 		player.move();
// 		expect(player.x).toBe(10);
// 		expect(player.y).toBe(5);
// 	})
// 	test('given  a player is at coordinates 9, 10 with an angle of 3pi/2 and a speed of 7, when move is called, then the resulting coordinates are 9, 3', () => {
// 		const player = new Player({ x: 9, y: 10 }, 3 * Math.PI / 2, 7, 1);
// 		player.move();
// 		expect(player.x).toBe(9);
// 		expect(player.y).toBe(3);
// 	})
// 	test('given  a player is at coordinates 9, 10 with an angle of pi/2 and a speed of 7, when move is called, then the resulting coordinates are 9, 24', () => {
// 		const player = new Player({ x: 9, y: 17 }, Math.PI / 2, 7, 1);
// 		player.move();
// 		expect(player.x).toBe(9);
// 		expect(player.y).toBe(24);
// 	})
//
// })
//
// describe('Player. turns', () => {
// 	test('given a player has a 0 degree heading, when the player.rotate is called with 90 degress is moved <turn interval> time, then the players angle is reset to 90 degress.', () => {
// 		const angle = 0
// 		const speed = 2
// 		const turnDistance = 11
// 		const player = new Player({ x: 1, y: 1 }, angle, speed, turnDistance);
//
// 		player.turnLeft()
//
// 		for (let i = 0; i < turnDistance; i += speed) {
// 			player.move()
// 		}
// 		expect(player.angle).toBe(Math.PI / 2)
// 	})
// 	test('rotating a player by -90 degrees should change the angle from 0 to 3*Math.PI / 2', () => {
// 		const angle = 0
// 		const speed = 2
// 		const turnDistance = 40
// 		const player = new Player({ x: 1, y: 1 }, angle, speed, turnDistance);
// 		player.turnRight()
// 		for (let i = 0; i < turnDistance; i += speed) {
// 			player.move()
// 		}
// 		expect(Math.abs(player.angle - (3 * Math.PI / 2))).toBeLessThan(0.0001);
// 	})
// })
//
// describe('Player.move - trail continuity', () => {
// 	test('creates a continuous trail when moving straight', () => {
// 		const player = new Player({ x: 0, y: 0 }, 0, 1, 10);
//
// 		for (let i = 0; i < 10; i++) {
// 			player.move();
// 		}
//
// 		const trail = player.trail;
// 		expect(trail.length).toBe(1);
// 		expect(trail[0].start).toEqual({ x: 0, y: 0 });
// 		expect(trail[0].end).toEqual({ x: 10, y: 0 });
// 	});
//
// 	test('creates a continuous trail when turning right', () => {
// 		const player = new Player({ x: 0, y: 0 }, 0, 1, 4); // 4 frames to turn
//
// 		player.move(); // start forward
// 		player.turnRight();
//
// 		for (let i = 0; i < 4; i++) {
// 			player.move(); // during turn
// 		}
//
// 		for (let i = 0; i < 5; i++) {
// 			player.move(); // after turn
// 		}
//
// 		const trail = player.trail;
// 		expect(trail.length).toBeGreaterThan(1);
// 		expect(isTrailContinuous(trail)).toBe(true);
// 	});
//
// 	test('creates a continuous trail with multiple turns', () => {
// 		const player = new Player({ x: 0, y: 0 }, 0, 1, 4);
//
// 		player.move();
// 		player.turnRight();
// 		for (let i = 0; i < 4; i++) player.move();
// 		for (let i = 0; i < 3; i++) player.move();
// 		player.turnLeft();
// 		for (let i = 0; i < 4; i++) player.move();
// 		for (let i = 0; i < 3; i++) player.move();
//
// 		const trail = player.trail;
// 		expect(trail.length).toBeGreaterThan(2);
// 		expect(isTrailContinuous(trail)).toBe(true);
// 	});
// });
describe('Player.move - turn angles', () => {
    test('hen player turns left, then they will not redirect until after crossing the turn distance', () => {
        const angle = 0;
        const speed = 1;
        const turnDistance = 4;
        const player = new Player({ x: 0, y: 0 }, angle, speed, turnDistance);
        expect(player.x).toEqual(0);
        expect(player.y).toEqual(0);
        player.turnLeft();
        player.move();
        expect(player.x).toEqual(1);
        expect(player.y).toEqual(0);
    });
});
