import { beforeEach, describe, test, expect } from '@jest/globals';
import { Arena } from './arena';
import { LineSegment } from '../geometry/interfaces';

describe('Arena Tests', () => {
	let arena: Arena;
	beforeEach(() => {
		const dimensions = { width: 10, height: 10 };
		const cellSize = 10;
		arena = new Arena(dimensions, cellSize);
	});
	test('initializes with walls', () => {
		expect(arena.walls.length).toBe(4);
	});
	test('should have correct boundary wall coordinates', () => {
		expect(arena.walls)
			.toContainEqual(
				expect.objectContaining(
					{ line: { start: { x: 0, y: 0 }, end: { x: 0, y: 10 } } }
				)
			)
		expect(arena.walls)
			.toContainEqual(
				expect.objectContaining(
					{ line: { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } } }
				)
			)
		expect(arena.walls)
			.toContainEqual(
				expect.objectContaining(
					{ line: { start: { x: 10, y: 0 }, end: { x: 10, y: 10 } } }
				)
			)
		expect(arena.walls)
			.toContainEqual(
				expect.objectContaining(
					{ line: { start: { x: 0, y: 10 }, end: { x: 10, y: 10 } } }
				)
			)
	});
})

describe('Arena grid lines', () => {
	let arena: Arena;
	beforeEach(() => {
		// create an area with size 10x10 and cell size 10
		const cellSize = 10;
		const size = { width: 10, height: 10 };
		arena = new Arena(size, cellSize);
	});

	test('should be 0 gridlines', () => {
		expect(arena.gridLines.length).toBe(0);
	});
})



