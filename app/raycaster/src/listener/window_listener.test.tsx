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
			{ type: 'turn', direction: Directions.LEFT }
		]);

	})

})
