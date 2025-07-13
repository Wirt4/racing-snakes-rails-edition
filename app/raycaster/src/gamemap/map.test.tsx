import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { ColorName } from '../game/color/color_name';
import { LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';

describe('GameMap basic map setup', () => {
	let gameMap: GameMap;

	beforeEach(() => {
		gameMap = new GameMap({ height: 10, width: 10 }, ColorName.BLACK, 1, { rotate: jest.fn(), move: jest.fn(), position: { x: 0, y: 0 }, angle: 0 });
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
		const gameMap = new GameMap({ width: 10, height: 10 }, ColorName.RED, 1, { rotate: jest.fn(), move: jest.fn(), position: { x: 0, y: 0 }, angle: 0 });
		gameMap.walls.forEach(wall => {
			expect(wall.color).toBe(ColorName.RED);
		});
	});

	describe('gridline generation', () => {
		let gameMap: GameMap;

		beforeEach(() => {
			gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, { rotate: jest.fn(), move: jest.fn(), position: { x: 0, y: 0 }, angle: 0 });
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
		gameMap = new GameMap({ width: 10, height: 11 }, ColorName.GREEN, 1, { rotate: jest.fn(), move: jest.fn(), position: { x: 1, y: 1 }, angle: 0 });
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
		gameMap = new GameMap({ width: 32, height: 11 }, ColorName.GREEN, 1, { rotate: jest.fn(), move: jest.fn(), position: { x: 16, y: 5 }, angle: 0 });
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
			ColorName.GREEN, 1, { rotate: jest.fn(), move: jest.fn(), position: { x: 0.001, y: 0.001 }, angle: 0 });

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
		player = { rotate: jest.fn((angle: number) => { }), move: jest.fn(() => { }), position: { x: 0, y: 0 }, angle: 0 };
	})
	test("angle should be passed to player class", () => {
		const payload = Math.PI / 4
		const gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, player);
		gameMap.turnPlayer(Math.PI / 4)
		expect(player.rotate).toHaveBeenLastCalledWith(payload)
	})
	test("movePlayer should call player.move", () => {
		const gameMap = new GameMap({ width: 10, height: 20 }, ColorName.RED, 1, player);
		gameMap.movePlayer()
		expect(player.move).toHaveBeenCalled()
	})
})

