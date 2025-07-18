import { describe, test, expect, } from '@jest/globals';
import { CoordinatesStack } from './coordinatesStack';
describe('CoordStack tests', () => {
	test('gridBatch.peek should throw if structure is empty', () => {
		const coordStack = new CoordinatesStack();
		expect(() => coordStack.peek()).toThrow('Stack is empty');
	})
	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(4, 2);
		//TODO: consider changing the function name peek to a getter for "Top"
		const result = coordStack.peek();

		expect(result.x).toEqual(4);
		expect(result.y).toEqual(2);
	})

	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(2, 6);
		coordStack.push(5, 3);

		const result = coordStack.peek();

		expect(result.x).toEqual(5);
		expect(result.y).toEqual(3);

		coordStack.freetop();
		const result2 = coordStack.peek();
		expect(result2.x).toEqual(2);
		expect(result2.y).toEqual(6);
	});
	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(2, 6);
		coordStack.push(5, 3);

		const result = coordStack.peek();
		expect(result.x).toEqual(5);
		expect(result.y).toEqual(3);

		coordStack.freetop();

		const result2 = coordStack.peek();
		expect(result2.x).toEqual(2);
		expect(result2.y).toEqual(6);
	});
	test('gridBatch.pop should return last added item', () => {
		const coordStack = new CoordinatesStack();
		coordStack.push(2, 6);
		coordStack.push(5, 3);
		const result = coordStack.peek();
		expect(result.x).toEqual(5);
		expect(result.y).toEqual(3);

		coordStack.freetop();

		const result2 = coordStack.peek();
		expect(result2.x).toEqual(2);
		expect(result2.y).toEqual(6);
	});


	test('gridBatch.push should adjust is goes beyond size', () => {
		const coordStack = new CoordinatesStack(1);
		coordStack.push(2, 6);
		coordStack.push(5, 3);

		const result = coordStack.peek();
		expect(result.x).toEqual(5);
		expect(result.y).toEqual(3);

		coordStack.freetop();

		const result2 = coordStack.peek();
		expect(result2.x).toEqual(2);
		expect(result2.y).toEqual(6);
	});
})
