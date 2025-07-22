import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { WallInterface } from '../gamemap/interface';
import { ColorName } from '../color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';

class MockPlayer implements PlayerInterface {
	x: number;
	y: number;
	angle: number;
	trail: WallInterface[];
	color = ColorName.RED;

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

describe('GameMap basic map setup', () => {
	let gameMap: GameMap;
	beforeEach(() => {
		gameMap = new GameMap(
			{ height: 10, width: 10 },
			ColorName.BLACK,
			1,
			new MockPlayer({ x: 1, y: 1 }, 0, [])
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
		const gameMap = new GameMap({ width: 10, height: 10 }, ColorName.RED, 1,
			new MockPlayer({ x: 1, y: 1 }, 0, [])
		);

		gameMap.walls.forEach(wall => {
			expect(wall.color).toBe(ColorName.RED);
		});
	});

	describe('gridline generation', () => {
		let gameMap: GameMap;

		beforeEach(() => {
			gameMap = new GameMap({ width: 10, height: 20 },
				ColorName.RED,
				1,
				new MockPlayer({ x: 1, y: 1 }, 0, [])
			);
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
		gameMap = new GameMap({ width: 10, height: 11 },
			ColorName.GREEN,
			1,
			new MockPlayer({ x: 1, y: 1 }, 0, [])
		);
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
		gameMap = new GameMap({ width: 32, height: 11 }, ColorName.GREEN, 1,
			new MockPlayer({ x: 16, y: 5 }, 0, [])
		);
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
		gameMap = new GameMap({
			width: 32,
			height: 11
		},
			ColorName.GREEN,
			1,
			new MockPlayer({ x: 0.001, y: 0.001 }, 0, [])
		);
		const slice = gameMap.castRay(Math.PI, 11);
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
	});

	test("angle should be passed to player class", () => {
		const gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, player);
		gameMap.turnPlayer(Math.PI / 2)
		expect(player.turnLeft).toHaveBeenLastCalledWith()
	});

	test("movePlayer should call player.move", () => {
		const gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, player);
		gameMap.movePlayer()
		expect(player.move).toHaveBeenCalled()
	});
});

describe('GameMap.castRay()', () => {

	test("should not return a hit for the trail segment currently being drawn (trail head)", () => {
		const position = { x: 5, y: 5 };
		const directionAngle = Math.PI / 4; // right

		const mockTrailHead: WallInterface = {
			line: {
				start: { x: 1, y: 5 },
				end: { x: 5, y: 5 }
			},
			color: ColorName.RED// same as player's current position
		};

		const player = new MockPlayer(position, directionAngle, [mockTrailHead]);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		const slice = map.castRay(directionAngle, 50);

		expect(slice.distance).not.toBe(0);
	});

	test("should detect player's own wall if from a tenable viewpoint", () => {
		const position = { x: 5, y: 4 };
		const directionAngle = 0
		const trailInfo: LineSegment[] = [{
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
			end: { x: 7, y: 4 }
		}
		];

		const mockTrail: WallInterface[] = trailInfo.map((line) => ({
			line: line,
			color: ColorName.RED,
		}));
		const player = new MockPlayer(position, directionAngle, mockTrail);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		const slice = map.castRay(directionAngle, 50);

		expect(slice.color).toBe(ColorName.RED);
	})
});

describe('GameMap.hasCollidedWithWall()', () => {
	test('should return true if player is on a wall', () => {
		const player = new MockPlayer({ x: 0, y: 10 }, Math.PI, []);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);
		expect(map.hasCollidedWithWall(player)).toBe(true);
	});

	test('should return false if player is not on a wall', () => {
		const player = new MockPlayer({ x: 1, y: 1 }, Math.PI, []);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);
		expect(map.hasCollidedWithWall(player)).toBe(false);
	});

	test('should return if player connects to a trail', () => {
		const player = new MockPlayer({ x: 5, y: 5 }, Math.PI, []);
		player.x = 1
		player.y = 5;

		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		const trailInfo: LineSegment[] = [{
			start: { x: 1, y: 1 },
			end: { x: 1, y: 10 }
		}, {
			start: { x: 1, y: 10 },
			end: { x: 10, y: 10 }

		}, {
			start: { x: 10, y: 10 },
			end: { x: 10, y: 5 }

		},
		{
			start: { x: 10, y: 5 },
			end: { x: 1, y: 5 }
		}
		];

		const mockTrail: WallInterface[] = trailInfo.map((line) => ({
			line: line,
			color: ColorName.RED,
		}));

		player.trail = mockTrail;

		expect(map.hasCollidedWithWall(player)).toBe(true);
	})
});
