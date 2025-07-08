import { describe, test, expect } from '@jest/globals';
import { GameMap } from './map';
import { ColorName } from '../game/color/color_name';
import { LineSegment } from '../geometry/interfaces';
describe('GameMap object tests', () => {
	test('map should intialize with walls aroundy', () => {
		const gameMap = new GameMap(10, 10);
		expect(gameMap.walls.length).toBe(4);
	})

	test('map should intialize with walls around boundary', () => {
		const gameMap = new GameMap(10, 10);
		const expectedLocations: LineSegment[] = [
			{ start: { x: 0, y: 0 }, end: { x: 0, y: 10 } },
			{ start: { x: 0, y: 0 }, end: { x: 10, y: 0 } },
			{ start: { x: 10, y: 0 }, end: { x: 10, y: 10 } },
			{ start: { x: 0, y: 10 }, end: { x: 10, y: 10 } }
		]
		expectedLocations.forEach((location) => {
			expect(gameMap.walls).toContainEqual(expect.objectContaining({
				line: location
			}));
		})
	})
	test('map walls should be configurable', () => {
		const gameMap = new GameMap(10, 10, ColorName.RED);
		gameMap.walls.forEach((wall) => {
			expect(wall.color).toBe(ColorName.RED);
		})
	});
	test('map should initialize with configurable gridlines, x coords', () => {
		const gameMap = new GameMap(10, 20, ColorName.RED, 1);
		expect(gameMap.gridLinesX.length).toBe(10);
	});
	test('map should initialize with configurable gridlines, y coords', () => {
		const gameMap = new GameMap(10, 20, ColorName.RED, 1);
		expect(gameMap.gridLinesY.length).toBe(20);
	})

})
