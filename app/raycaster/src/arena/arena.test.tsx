import { describe, test, expect } from '@jest/globals';
import { Arena } from './arena';

describe('Arena Tests', () => {
	test('initializes with walls', () => {
		const arena = new Arena(10, 10);
		expect(arena.walls.length).toBe(4);
	});
})
