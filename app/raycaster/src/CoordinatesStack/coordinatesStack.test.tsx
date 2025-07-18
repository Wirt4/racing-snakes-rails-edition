import { describe, test, expect, } from '@jest/globals';
import { CoordinatesStack } from './coordinatesStack';
describe('CoordStack tests', () => {
	test('gridBatch.peek should throw if structure is empty', () => {
		const coordStack = new CoordinatesStack();
		expect(() => coordStack.top).toThrow('Stack is empty');
	})
	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(4, 2);

		expect(coordStack.top.x).toEqual(4);
		expect(coordStack.top.y).toEqual(2);
	})

	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(2, 6);
		coordStack.push(5, 3);

		expect(coordStack.top.x).toEqual(5);
		expect(coordStack.top.y).toEqual(3);

		coordStack.freetop();
		expect(coordStack.top.x).toEqual(2);
		expect(coordStack.top.y).toEqual(6);
	})
	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(2, 6);
		coordStack.push(5, 3);

		expect(coordStack.top.x).toEqual(5);
		expect(coordStack.top.y).toEqual(3);

		coordStack.freetop();

		expect(coordStack.top.x).toEqual(2);
		expect(coordStack.top.y).toEqual(6);
	});
	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(2, 6);
		coordStack.push(5, 3);
		expect(coordStack.top.x).toEqual(5);
		expect(coordStack.top.y).toEqual(3);

		coordStack.freetop();

		expect(coordStack.top.x).toEqual(2);
		expect(coordStack.top.y).toEqual(6);
	});


	test('gridBatch.push should adjust is goes beyond size', () => {
		const coordStack = new CoordinatesStack(1);
		coordStack.push(2, 6);
		coordStack.push(5, 3);

		expect(coordStack.top.x).toEqual(5);
		expect(coordStack.top.y).toEqual(3);

		coordStack.freetop();

		expect(coordStack.top.x).toEqual(2);
		expect(coordStack.top.y).toEqual(6);
	});
})
