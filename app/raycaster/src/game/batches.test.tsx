import { describe, test, expect, } from '@jest/globals';
import { Batches } from './batches';
import { ColorName } from './color/color_name';

describe('object is mutable', () => {
	test('batches.clear() should clear the batches', () => {
		const batches = new Batches();
		batches.addWallSlice(ColorName.RED, 0.5, { x: 0, y: 0 }, 10);


		expect(batches.wallBatches.size).toBe(1);
		batches.addMapWall({ color: ColorName.BLUE, line: { start: { x: 1, y: 1 }, end: { x: 2, y: 2 } } });
		batches.addGridPoint({ x: 3, y: 3 });

		expect(batches.gridBatch.isEmpty).toBe(false);
		expect(batches.wallBatches.size).toBe(1);
		expect(batches.mapBatches.size).toBe(1);

		batches.clear();

		expect(batches.gridBatch.isEmpty).toBe(true);
		expect(batches.wallBatches.size).toBe(0);
		expect(batches.mapBatches.size).toBe(0);
	});
	test('gridBatch.pop should throw if structure is empty', () => {
		const batches = new Batches();
		expect(() => batches.gridBatch.pop()).toThrow('Stack is empty');
	})
	test('gridBatch.pop should return last added item', () => {
		const batches = new Batches();
		batches.gridBatch.push(4, 2);

		const result = batches.gridBatch.pop();

		expect(result.x).toEqual(4);
		expect(result.y).toEqual(2);
	})

})
