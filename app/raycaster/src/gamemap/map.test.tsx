import { describe, test, expect } from '@jest/globals';
import { GameMap } from './map';
describe('GameMap object tests', () => {
	test('map should intialize with walls around boundary', () => {
		const gameMap = new GameMap(10, 10);
		expect(gameMap.walls.length).toBe(4);
	})
	test('map should initialize with  gridlines', () => {
		//todo
		//assert(false);
	})
})
