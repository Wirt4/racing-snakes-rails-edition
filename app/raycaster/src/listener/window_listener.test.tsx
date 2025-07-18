import { Listener } from './listener';
import { describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';

describe('Keydown Tests', () => {
	test('should handle keydown events', () => {
		const mockWorker = { postMessage: jest.fn() };
		const listener = new Listener(mockWorker as unknown as Worker);
		const keyStroke = 'ArrowLeft';

		listener.keydown(keyStroke);

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.LEFT
		});
	})
})
