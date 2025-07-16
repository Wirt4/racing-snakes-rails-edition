import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { Dimensions } from '../geometry/interfaces'
import { ColorName } from '../game/color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';

describe('GameMap basic map setup', () => {
	let gameMap: GameMap;

	beforeEach(() => {
		gameMap = new GameMap(
			{ height: 10, width: 10 },
			ColorName.BLACK,
			1,
			{
				turnLeft: jest.fn(),
				turnRight: jest.fn(),
				move: jest.fn(),
				x: 1,
				y: 1,
				angle: 0,
				color: ColorName.GREEN,
				trail: []
			}
		);
	});

	test('should initialize with 4 boundary walls', () => {
		expect(gameMap.walls.length).toBe(4);
	});

	test('should have correct boundary wall coordinates', () => {
		const expectedLocations: LineSegment[] = [
			{ start: { x: 0, y: 0 }, end: { x: 0, y: 10 } },
			{ start: { x: 0, y: 0 }, end: { x: 10, y: 0 } },
			{ start: { x: 10, y: 0 }, end: { x: 10, y: 10 } },
			{ start: { x: 0, y: 10 }, end: { x: 10, y: 10 } }
		];
		expectedLocations.forEach(location => {
			expect(gameMap.walls).toContainEqual(
				expect.objectContaining({ line: location })
			);
		});
	});
});

describe('GameMap configuration options', () => {
	test('walls should be configurable by color', () => {
		const gameMap = new GameMap({ width: 10, height: 10 }, ColorName.RED, 1, {
			turnLeft: jest.fn(),
			turnRight: jest.fn(),
			move: jest.fn(), x: 1, y: 1, angle: 0, color: ColorName.GREEN,
			trail: []
		}
		);
		gameMap.walls.forEach(wall => {
			expect(wall.color).toBe(ColorName.RED);
		});
	});

	describe('gridline generation', () => {
		let gameMap: GameMap;

		beforeEach(() => {
			gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, {
				turnLeft: jest.fn(),
				turnRight: jest.fn(),
				trail: [],
				color: ColorName.WHITE,
				move: jest.fn(), x: 1, y: 1,
				angle: 0
			});
		});

		test('should initialize correct number of X gridlines', () => {
			expect(gameMap.gridLinesX.length).toBe(10);
		});

		test('should initialize correct number of Y gridlines', () => {
			expect(gameMap.gridLinesY.length).toBe(20);
		});
	});
});

describe('castRay method', () => {
	let gameMap: GameMap;

	beforeEach(() => {
		gameMap = new GameMap({ width: 10, height: 11 }, ColorName.GREEN, 1, {
			color: ColorName.GREEN,
			trail: [], turnLeft: jest.fn(), turnRight: jest.fn(), move: jest.fn(), x: 1, y: 1, angle: 0
		});
	});

	test('should return correct distance when ray hits boundary wall directly (0°)', () => {
		const expectedDistance = 9;
		const slice = gameMap.castRay(0, 11);
		expect(slice.distance).toBeCloseTo(expectedDistance, 5);
	});

	test('should return correct distance when ray hits boundary at 45°', () => {
		const expectedDistance = Math.sqrt((10 - 1) ** 2 + (11 - 1) ** 2);
		const slice = gameMap.castRay(Math.atan2(10, 9), 20);
		expect(slice.distance).toBeCloseTo(expectedDistance, 5);
	});

	test('should return max distance if ray hits nothing (looking away from all walls)', () => {
		gameMap = new GameMap({ width: 32, height: 11 }, ColorName.GREEN, 1, {
			trail: [],
			color: ColorName.RED,
			turnLeft: jest.fn(),
			turnRight: jest.fn(),
			move: jest.fn(), x: 16, y: 5, angle: 0
		});
		const slice = gameMap.castRay(Math.PI, 15); // Facing negative x direction
		expect(slice.distance).toEqual(15);
		expect(slice.color).toEqual(ColorName.NONE);
	});


	test('should return same point for zero-length ray', () => {
		const slice = gameMap.castRay(0, 0);
		expect(slice.distance).toEqual(0);
		expect(slice.intersection).toEqual(gameMap.playerPosition);
	});

	test('should return correct intersection for vertical ray', () => {
		const slice = gameMap.castRay(Math.PI / 2, 11); // Upward
		expect(slice.intersection.x).toBeCloseTo(1, 5);
		expect(slice.intersection.y).toBeGreaterThan(1);
	});

	test('should handle grazing corner case gracefully', () => {
		// Grazing between two walls at (0,0)
		gameMap = new GameMap({
			width: 32,
			height: 11
		},
			ColorName.GREEN, 1, {
			turnLeft: jest.fn(), turnRight: jest.fn(),
			move: jest.fn(), x: 0.001, y: 0.001, angle: 0,
			color: ColorName.GREEN, trail: []
		});

		const slice = gameMap.castRay(Math.PI, 11); // Facing left
		expect(slice.distance).toBeGreaterThan(0);
	});

	test('should not crash on near-parallel ray to a wall', () => {
		const epsilon = 1e-8;
		const slice = gameMap.castRay(epsilon, 20);
		expect(slice.distance).toBeGreaterThan(0);
	});
});
describe("Player tests", () => {
	let player: PlayerInterface;
	beforeEach(() => {
		player = {
			turnLeft: jest.fn(() => { }), turnRight: jest.fn(), move: jest.fn(() => { }), x: 1, y: 1, angle: 0, color: ColorName.GREEN,
			trail: []
		};
	})
	test("angle should be passed to player class", () => {
		const gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, player);
		gameMap.turnPlayer(Math.PI / 2)
		expect(player.turnLeft).toHaveBeenLastCalledWith()
	})
	test("movePlayer should call player.move", () => {
		const gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, player);
		gameMap.movePlayer()
		expect(player.move).toHaveBeenCalled()
	})
})
describe('intialization tests', () => {
	let dimensions: Dimensions
	let color: ColorName
	let grid_size: number
	let player: PlayerInterface
	beforeEach(() => {
		dimensions = { width: 100, height: 200 }
		color = ColorName.RED
		grid_size = 5
		player = {
			turnLeft: () => { }, turnRight: () => { }, move: () => { },
			x: -1, y: -1, angle: 0, color: ColorName.GREEN,
			trail: []

		}
	})
	test('game map may not intialize with player position touching walls: left', () => {
		player.x = 0
		player.y = 5
		expect(() => new GameMap(dimensions, color, grid_size, player)).toThrow()
	})
	test('game map may not intialize with player position touching walls: top', () => {
		player.x = 5
		player.y = 0
		expect(() => new GameMap(dimensions, color, grid_size, player)).toThrow()
	})
	test('game map may not intialize with player position touching walls: right', () => {
		player.x = 100
		player.y = 5
		expect(() => new GameMap(dimensions, color, grid_size, player)).toThrow()
	})
	test('game map may not intialize with player position touching walls: bottom', () => {
		player.x = 4
		player.y = 200
		expect(() => new GameMap(dimensions, color, grid_size, player)).toThrow()
	})
})


class MockPlayer implements PlayerInterface {
	x: number;
	y: number;
	angle: number;
	trail: LineSegment[];
	color = ColorName.RED;
	constructor(pos: Coordinates, angle: number, trail: LineSegment[]) {
		this.x = pos.x;
		this.y = pos.y;
		this.angle = angle;
		this.trail = trail;
	}
	move(): void { }
	turnLeft(): void { }
	turnRight(): void { }
}

describe('GameMap.castRay()', () => {
	test("should not return a hit for the trail segment currently being drawn (trail head)", () => {
		const position = { x: 5, y: 5 };
		const directionAngle = Math.PI / 4; // right

		const mockTrailHead: LineSegment = {
			start: { x: 1, y: 5 },
			end: { x: 5, y: 5 } // same as player's current position
		};

		const player = new MockPlayer(position, directionAngle, [mockTrailHead]);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		const slice = map.castRay(directionAngle, 50);

		expect(slice.distance).not.toBe(0);
	});
	test("should detect player's own wall if from a tenable viewpoint", () => {
		const position = { x: 5, y: 4 };
		const directionAngle = 7 * Math.PI / 4

		const mockTrail: LineSegment[] = [
			{
				start: { x: 7, y: 2 },
				end: { x: 7, y: 8 }
			}, {
				start: { x: 7, y: 8 },
				end: { x: 3, y: 8 }
			}, {
				start: { x: 3, y: 8 },
				end: { x: 3, y: 4 }
			},
			{
				start: { x: 3, y: 4 },
				end: { x: 5, y: 4 }
			}
		];

		const player = new MockPlayer(position, directionAngle, mockTrail);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		const slice = map.castRay(directionAngle, 50);

		expect(Math.abs(slice.distance - Math.sqrt(8))).toBeLessThan(0.01);
	});

});
