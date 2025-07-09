import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameMap } from './map';
import { ColorName } from '../game/color/color_name';
import { LineSegment } from '../geometry/interfaces';

describe('GameMap basic map setup', () => {
	let gameMap: GameMap;

	beforeEach(() => {
		gameMap = new GameMap(10, 10);
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
		const gameMap = new GameMap(10, 10, ColorName.RED);
		gameMap.walls.forEach(wall => {
			expect(wall.color).toBe(ColorName.RED);
		});
	});

	describe('gridline generation', () => {
		let gameMap: GameMap;

		beforeEach(() => {
			gameMap = new GameMap(10, 20, ColorName.RED, 1);
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
		gameMap = new GameMap(10, 10, ColorName.GREEN);
	});
	test('should return the correct color and distance for a wall, basic example', () => {
		const gameMap = new GameMap(10, 10, ColorName.GREEN);
		expect(gameMap.playerPosition).toEqual({ x: 0, y: 0 })
		const expectedDistance = 10
		const slice = gameMap.castRay(0)
		expect(slice.distance).toEqual(expectedDistance)
	})
	test('should return the correct color and distance for a wall, with an angle', () => {
		const gameMap = new GameMap(10, 10, ColorName.GREEN);
		expect(gameMap.playerPosition).toEqual({ x: 0, y: 0 })
		const expectedDistance = 10 * Math.sqrt(2)
		const slice = gameMap.castRay(Math.PI / 4) //45 degrees for an easy calcuation
		expect(slice.distance).toEqual(expectedDistance)
	})

})
