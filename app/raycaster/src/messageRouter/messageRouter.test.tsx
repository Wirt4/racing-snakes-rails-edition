import { describe, test, afterEach, expect, beforeEach, jest } from '@jest/globals';
import { MessageRouter } from './messageRouter';

describe('MessageRouter', () => {
	let mockHandlerA: jest.Mock;
	let mockHandlerB: jest.Mock;
	let consoleWarnSpy: jest.Spied<typeof console.warn>;

	beforeEach(() => {
		mockHandlerA = jest.fn();
		mockHandlerB = jest.fn();
		consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should handle message routing for known message type', () => {
		const router = new MessageRouter({
			init: mockHandlerA,
		});
		const event = new MessageEvent('message', {
			data: { type: 'init', payload: { foo: 'bar' } }
		});

		router.handleMessage(event);

		expect(mockHandlerA).toHaveBeenCalledWith({ type: 'init', payload: { foo: 'bar' } });
	});
});
