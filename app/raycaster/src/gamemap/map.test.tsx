import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { WallInterface } from '../wall/interface';
import { ColorName } from '../color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';
import { ArenaInterface } from '../arena/interface';

class MockPlayer implements PlayerInterface {
	x: number;
	y: number;
	angle: number;
	trail: WallInterface[];
	color = ColorName.RED;
	hasCollided = () => false;

	constructor(pos: Coordinates, angle: number, trail: WallInterface[]) {
		this.x = pos.x;
		this.y = pos.y;
		this.angle = angle;
		this.trail = trail;
	}

	move(): void { }
	turnLeft(): void { }
	turnRight(): void { }
}


describe('GameMap configuration options', () => {
	test('walls should be configurable by color', () => {
		const arena: ArenaInterface = { gridLines: [], walls: [], containsCoordinates: () => true };
		const gameMap = new GameMap(arena,
			new MockPlayer({ x: 1, y: 1 }, 0, [])
		);

		gameMap.walls.forEach(wall => {
			expect(wall.color).toBe(ColorName.RED);
		});
	});
})

describe("Player tests", () => {
	let player: PlayerInterface;
	let arena: ArenaInterface;
	beforeEach(() => {
		player = {
			turnLeft: jest.fn(() => { }), turnRight: jest.fn(), move: jest.fn(() => { }), x: 1, y: 1, angle: 0, color: ColorName.GREEN,
			trail: [],
			hasCollided: jest.fn(() => false)
		};
		arena = { walls: [], gridLines: [], containsCoordinates: () => true };
	});

	test("angle should be passed to player class", () => {
		const gameMap = new GameMap(arena, player);
		gameMap.turnPlayer(Math.PI / 2)
		expect(player.turnLeft).toHaveBeenLastCalledWith()
	});

	test("movePlayer should call player.move", () => {
		const gameMap = new GameMap(arena, player);
		gameMap.movePlayer()
		expect(player.move).toHaveBeenCalled()
	});
});
