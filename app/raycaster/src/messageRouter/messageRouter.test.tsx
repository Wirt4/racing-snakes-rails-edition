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

	test('logs a warning for unknown message types', () => {
		const router = new MessageRouter({
			init: mockHandlerA,
		});

		const event = new MessageEvent('message', {
			data: { type: 'bad', payload: {} }
		});

		router.handleMessage(event);

		expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown message type: bad');
		expect(mockHandlerA).not.toHaveBeenCalled();
	});

	test('can handle multiple message types independently', () => {
		const router = new MessageRouter({
			init: mockHandlerA,
			turn: mockHandlerB,
		});

		const event1 = new MessageEvent('message', { data: { type: 'init', foo: 1 } });
		const event2 = new MessageEvent('message', { data: { type: 'turn', direction: 'LEFT' } });

		router.handleMessage(event1);
		router.handleMessage(event2);

		expect(mockHandlerA).toHaveBeenCalledWith({ type: 'init', foo: 1 });
		expect(mockHandlerB).toHaveBeenCalledWith({ type: 'turn', direction: 'LEFT' });
	});
});
