import { Listener } from './listener';
import { describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';

describe('Keydown Tests', () => {
	test('should turn left', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);
		const keyStroke = 'ArrowLeft';

		listener.keydown(keyStroke);

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.LEFT
		});
	})
	test('if user hits the same key twice, just call the worker post once', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);
		const keyStroke = 'ArrowLeft';

		listener.keydown(keyStroke);
		listener.keydown(keyStroke);

		expect(mockWorker.postMessage.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }]
		]);
	})

	test('should turn right', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);
		const keyStroke = 'ArrowRight';

		listener.keydown(keyStroke);

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.RIGHT
		});
	})

	test('should turn right after turning left', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);

		listener.keydown('ArrowLeft');
		listener.keydown('ArrowRight');

		expect(mockWorker.postMessage.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }],
			[{ type: 'turn', direction: Directions.RIGHT }]
		]);
	})
	test('should not turn if the same key is pressed twice', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);

		listener.keydown('ArrowLeft');
		listener.keydown('ArrowLeft');

		expect(mockWorker.postMessage.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }]
		]);
	})
	test('shoult not accept any keys other than ArrowLeft or ArrowRight', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);

		listener.keydown('a');

		expect(mockWorker.postMessage).not.toHaveBeenCalled();
	})
	test('can turn left again after releasing arrow left key', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);
		const keyStroke = 'ArrowLeft';
		listener.keydown(keyStroke);
		listener.keyup(keyStroke);
		expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
	})
})
