import { describe, beforeEach, jest, afterEach, expect, test } from '@jest/globals';
import { LoopDriver } from './loopDriver';

describe('LoopDriver', () => {
	let cb: jest.Mock;
	beforeEach(() => {
		cb = jest.fn();
		jest.useFakeTimers();
		jest.clearAllTimers();
	})
	afterEach(() => {
		jest.useRealTimers();
	})

	test('calls the callback repeatedly after start at every interval point, 100 ms interval', () => {
		const driver = new LoopDriver(100);

		driver.start(cb);
		jest.advanceTimersByTime(350); //100ms interval

		expect(cb).toHaveBeenCalledTimes(3);
	});

	test('calls the callback repeatedly after start at every interval point, 200 ms interval', () => {

		const driver = new LoopDriver(200);
		driver.start(cb);
		jest.advanceTimersByTime(1600); //200ms interval

		expect(cb).toHaveBeenCalledTimes(8);
	});

	test('calling start multiple times only starts one interval', () => {
		const driver = new LoopDriver(100);
		driver.start(cb);
		driver.start(cb);

		jest.advanceTimersByTime(200);

		expect(cb).toHaveBeenCalledTimes(2);
	});

	test('calling stop clears the interval', () => {
		const driver = new LoopDriver(100);
		driver.start(cb);
		driver.stop();

		jest.advanceTimersByTime(500);

		expect(cb).toHaveBeenCalledTimes(0);
	});
})
