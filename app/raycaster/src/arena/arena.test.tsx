import { beforeEach, describe, test, expect } from '@jest/globals';
import { Arena } from './arena';
import { LineSegment } from '../geometry/interfaces';

describe('Arena Tests', () => {
	let arena: Arena;
	beforeEach(() => {
		arena = new Arena({ width: 10, height: 10 });
	});
	test('initializes with walls', () => {
		expect(arena.walls.length).toBe(4);
	});
	test('should have correct boundary wall coordinates', () => {
		const expectedLocations: LineSegment[] = [
			{ start: { x: 0, y: 0 }, end: { x: 0, y: 10 } },
			{ start: { x: 0, y: 0 }, end: { x: 10, y: 0 } },
			{ start: { x: 10, y: 0 }, end: { x: 10, y: 10 } },
			{ start: { x: 0, y: 10 }, end: { x: 10, y: 10 } }
		];
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
