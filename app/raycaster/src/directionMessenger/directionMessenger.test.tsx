import { jest, describe, test, expect } from '@jest/globals';
import { DirectionMessenger } from './directionMessenger';
import { Directions } from '../controls/directions';

describe('directionMessenger', () => {
	test('sendTurn should call worker.postMessage with the correct direction', () => {
		const mockWorker = {
			postMessage: jest.fn(),
		};

		const directionMessenger = new DirectionMessenger(mockWorker as unknown as Worker);


		directionMessenger.sendTurn(Directions.LEFT);
		expect(mockWorker.postMessage)
			.toHaveBeenCalledWith
			(expect.objectContaining(
				{ direction: Directions.LEFT, type: 'turn' }
			));
	})
})
