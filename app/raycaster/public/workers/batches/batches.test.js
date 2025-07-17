import { describe, test, expect, } from '@jest/globals';
import { Batches, CoordinatesStack } from './batches';
import { ColorName } from '../color/color_name';
describe('object is mutable', () => {
    test('batches.clear() should clear the batches', () => {
        const batches = new Batches();
        batches.addWallSlice(ColorName.RED, 0.5, 0, 0, 10);
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
});
describe('CoordStack tests', () => {
    test('gridBatch.pop should throw if structure is empty', () => {
        const coordStack = new CoordinatesStack();
        expect(() => coordStack.pop()).toThrow('Stack is empty');
    });
    test('gridBatch.pop should return last added item', () => {
        const coordStack = new CoordinatesStack();
        coordStack.push(4, 2);
        const result = coordStack.pop();
        expect(result.x).toEqual(4);
        expect(result.y).toEqual(2);
    });
    test('gridBatch.pop should return last added item', () => {
        const coordStack = new CoordinatesStack();
        coordStack.push(2, 6);
        coordStack.push(5, 3);
        const result = coordStack.pop();
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(3);
        const result2 = coordStack.pop();
        expect(result2.x).toEqual(2);
        expect(result2.y).toEqual(6);
    });
    test('gridBatch.pop should return last added item', () => {
        const coordStack = new CoordinatesStack();
        coordStack.push(2, 6);
        coordStack.push(5, 3);
        const result = coordStack.pop();
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(3);
        const result2 = coordStack.pop();
        expect(result2.x).toEqual(2);
        expect(result2.y).toEqual(6);
    });
    test('gridBatch.pop should return last added item', () => {
        const coordStack = new CoordinatesStack();
        coordStack.push(2, 6);
        coordStack.push(5, 3);
        const result = coordStack.pop();
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(3);
        const result2 = coordStack.pop();
        expect(result2.x).toEqual(2);
        expect(result2.y).toEqual(6);
    });
    test('gridBatch.pop should adjust is goes beyond size', () => {
        const coordStack = new CoordinatesStack(1);
        coordStack.push(2, 6);
        coordStack.push(5, 3);
        const result = coordStack.pop();
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(3);
        const result2 = coordStack.pop();
        expect(result2.x).toEqual(2);
        expect(result2.y).toEqual(6);
    });
});
