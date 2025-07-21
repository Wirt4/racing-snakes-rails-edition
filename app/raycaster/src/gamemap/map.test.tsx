import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { WallInterface } from '../gamemap/interface';
import { Dimensions } from '../geometry/interfaces'
import { ColorName } from '../color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';
import { TrailInterface, TrailSegment } from '../trail/interface';

class MockTrail implements TrailInterface {
	head: TrailSegment;
	tail: TrailSegment;
	color = ColorName.RED;
	constructor(origin: Coordinates) {
		this.head = origin;
		this.tail = origin;
	}
	append(x: number, y: number): void {
		const temp = { x, y };
		this.head.next = temp;
		this.head = temp;
	}
}

class MockPlayer implements PlayerInterface {
	x: number;
	y: number;
	angle: number;
	color = ColorName.RED;
	trail: TrailInterface;

	constructor(pos: Coordinates, angle: number, trail: TrailInterface) {
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
			new MockPlayer({ x: 1, y: 1 }, 0, new MockTrail({ x: 1, y: 1 }))
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
			new MockPlayer({ x: 1, y: 1 }, 0, new MockTrail({ x: 1, y: 1 }))
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
				new MockPlayer({ x: 1, y: 1 }, 0, new MockTrail({ x: 1, y: 1 }))
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
			new MockPlayer({ x: 1, y: 1 }, 0, new MockTrail({ x: 1, y: 1 }))
		);
	});

	test('should return correct distance when ray hits boundary wall directly (0°)', () => {
		const expectedDistance = 9;
		gameMap.castRay(0, 11);
		expect(gameMap.currentSlice.distance).toBeCloseTo(expectedDistance, 5);
	});

	test('should return correct distance when ray hits boundary at 45°', () => {
		const expectedDistance = Math.sqrt((10 - 1) ** 2 + (11 - 1) ** 2);
		gameMap.castRay(Math.atan2(10, 9), 20);
		expect(gameMap.currentSlice.distance).toBeCloseTo(expectedDistance, 5);
	});

	test('should return max distance if ray hits nothing (looking away from all walls)', () => {
		gameMap = new GameMap({ width: 32, height: 11 }, ColorName.GREEN, 1,
			new MockPlayer({ x: 16, y: 5 }, 0, new MockTrail({ x: 16, y: 5 }))
		);
		gameMap.castRay(Math.PI, 15); // Facing negative x direction
		expect(gameMap.currentSlice.distance).toEqual(15);
		expect(gameMap.currentSlice.color).toEqual(ColorName.NONE);
	});


	test('should return same point for zero-length ray', () => {
		gameMap.castRay(0, 0);
		expect(gameMap.currentSlice.distance).toEqual(0);
		expect(gameMap.currentSlice.intersection).toEqual(gameMap.playerPosition);
	});

	test('should return correct intersection for vertical ray', () => {
		gameMap.castRay(Math.PI / 2, 11); // Upward
		expect(gameMap.currentSlice.intersection.x).toBeCloseTo(1, 5);
		expect(gameMap.currentSlice.intersection.y).toBeGreaterThan(1);
	});

	test('should handle grazing corner case gracefully', () => {
		gameMap = new GameMap({
			width: 32,
			height: 11
		},
			ColorName.GREEN,
			1,
			new MockPlayer({ x: 0.001, y: 0.001 }, 0, new MockTrail({ x: 0.001, y: 0.001 }))
		);
		gameMap.castRay(Math.PI, 11);
		expect(gameMap.currentSlice.distance).toBeGreaterThan(0);
	});

	test('should not crash on near-parallel ray to a wall', () => {
		const epsilon = 1e-8;
		gameMap.castRay(epsilon, 20);
		expect(gameMap.currentSlice.distance).toBeGreaterThan(0);
	});
});
describe("Player tests", () => {
	let player: PlayerInterface;
	beforeEach(() => {
		player = {
			turnLeft: jest.fn(() => { }), turnRight: jest.fn(), move: jest.fn(() => { }), x: 1, y: 1, angle: 0, color: ColorName.GREEN,
			trail: {
				append: jest.fn(),
				head: { x: 0, y: 0 },
				tail: { x: 0, y: 0 },
				color: ColorName.GREEN,
			}
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
		player = new MockPlayer({ x: -1, y: -1 }, 0, new MockTrail({ x: -1, y: -1 }))
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
		const trail = new MockTrail(position);
		trail.head = { x: 1, y: 5 }; // Set the head to the same position as the mockTrailHead

		const player = new MockPlayer(position, directionAngle, trail);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		map.castRay(directionAngle, 50);

		expect(map.currentSlice.distance).not.toBe(0);
	});

	test("should detect player's own wall if from a tenable viewpoint", () => {
		const position = { x: 5, y: 4 };
		const directionAngle = 0
		const trailInfo: Coordinates[] = [
			{ x: 7, y: 8 },
			{ x: 3, y: 8 },
			{ x: 3, y: 4 },
			{ x: 5, y: 4 },
		];

		const trail = new MockTrail({ x: 7, y: 2 });
		trailInfo.forEach((point) => {
			trail.append(point.x, point.y);
		})
		const player = new MockPlayer(position, directionAngle, trail);
		const map = new GameMap({ width: 50, height: 50 }, ColorName.BLACK, 10, player);

		map.castRay(directionAngle, 50);

		expect(map.currentSlice.color).toBe(ColorName.RED);
	})
});
