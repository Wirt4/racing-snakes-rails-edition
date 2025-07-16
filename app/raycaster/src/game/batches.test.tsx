import { describe, test, expect, } from '@jest/globals';
import { Batches } from './batches';
describe('object is mutable', () => {
	test('batches.clear() should clear the batches', () => {
		const batches = new Batches();
		batches.addWallSlice('red', 0.5, { x: 0, y: 0 }, 10);
		expect(batches.wallBatches['red_0.5'].length).toBe(1);
		batches.addMapWall({ color: 'blue', line: { start: { x: 1, y: 1 }, end: { x: 2, y: 2 } } });
		batches.addGridPoint({ x: 3, y: 3 });

		expect(batches.gridBatch.length).toBe(1);
		expect(Object.keys(batches.wallBatches).length).toBe(1);
		expect(Object.keys(batches.mapBatches).length).toBe(1);

		batches.clear();

		expect(batches.gridBatch.length).toBe(0);
		expect(Object.keys(batches.wallBatches).length).toBe(0);
		expect(Object.keys(batches.mapBatches).length).toBe(0);
	})
})
