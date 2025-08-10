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
	let cellSize: number;
	let dimensions: { width: number, height: number };

	beforeEach(() => {
		// create an area with size 10x10 and cell size 10
		cellSize = 5;
		dimensions = { width: 10, height: 10 };
		arena = new Arena(dimensions, cellSize);
	});

	test('should be 0 gridlines', () => {
		cellSize = 10;
		arena = new Arena(dimensions, cellSize);
		expect(arena.gridLines.length).toBe(0);
	});
	test('should contain two grid lines', () => {
		expect(arena.gridLines.length).toBe(2);
	});
	test('one grid line should be vertical, the other should be horizontal', () => {
		// create the 10x10 grid with cell size 5
		expect(containsOnlyOne(arena.gridLines, isVertical)).toBe(true);
		// arena.gridLines should contain one horizontalline
	})
})

function isVertical(line: LineSegment): boolean {
	return line.start.x === line.end.x;
}
//
//
//isHorizontal
////line.start.y === line.end.y

function containsOnlyOne(gridLines: Array<LineSegment>, lambda: (line: LineSegment) => boolean): boolean {
	let result = false
	for (const line of gridLines) {
		if (lambda(line)) {
			// if we find a second line that matches the condition, return false
			if (result === true) {
				return false;
			} else {
				result = true;
			}
		}
	}
	return result
}
