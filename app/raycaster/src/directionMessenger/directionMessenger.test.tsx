import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { DirectionMessenger } from './directionMessenger';
import { Directions } from '../controls/directions';

describe('directionMessenger', () => {
	let mockWorker: Worker;
	let directionMessenger: DirectionMessenger;

	beforeEach(() => {
		mockWorker = {
			postMessage: jest.fn(),
		} as unknown as Worker;
		directionMessenger = new DirectionMessenger(mockWorker);
	});

	test('sendTurn should call worker.postMessage with LEFT', () => {
		directionMessenger.sendTurn(Directions.LEFT);
		expect(mockWorker.postMessage)
			.toHaveBeenCalledWith
			(expect.objectContaining(
				{ direction: Directions.LEFT, type: 'turn' }
			));
	});

	test('sendTurn should call worker.postMessage with RIGHT', () => {
		directionMessenger.sendTurn(Directions.RIGHT);
		expect(mockWorker.postMessage)
			.toHaveBeenCalledWith
			(expect.objectContaining(
				{ direction: Directions.RIGHT, type: 'turn' }
			));
	});
})
