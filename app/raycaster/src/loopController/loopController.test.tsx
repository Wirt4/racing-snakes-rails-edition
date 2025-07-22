import { LoopController } from './loopController';
import { LoopDriverInterface } from '../loopDriver/interface';
import { describe, beforeEach, test, jest, expect } from '@jest/globals';

describe('LoopController.start', () => {
	let driver: LoopDriverInterface;
	let loopController: LoopController;
	let clear: () => void;
	let update: () => void;
	let draw: () => void;

	beforeEach(() => {
		clear = jest.fn();
		update = jest.fn();
		draw = jest.fn();
		driver = {
			start: jest.fn(),
			stop: jest.fn(),
		};
		loopController = new LoopController(clear, update, draw, driver);
	});

	test('calling start should call driver.start', () => {
		loopController.start();
		expect(driver.start).toHaveBeenCalled();
	})

	test('may not call driver.start twice in a row', () => {
		loopController.start();
		loopController.start();

		expect(driver.start).toHaveBeenCalledTimes(1);
	})

	test('driver.start should be called with loopController.gameTick', () => {
		loopController.start();
		expect(driver.start).toHaveBeenCalledWith(loopController.gameTick);
	})
})

describe('LoopController.gameTick', () => {
	let driver: LoopDriverInterface;
	let loopController: LoopController;
	let clear: () => void;
	let update: () => void;
	let draw: () => void;

	beforeEach(() => {
		driver = {
			start: jest.fn(),
			stop: jest.fn(),
		};
		clear = jest.fn();
		update = jest.fn();
		draw = jest.fn();
		loopController = new LoopController(clear, update, draw, driver);
	});

	test('gameTick should clear the frame', () => {
		loopController.gameTick()
		expect(clear).toHaveBeenCalledTimes(1);
	})

	test('gameTick should call update', () => {
		loopController.gameTick();
		expect(update).toHaveBeenCalledTimes(1);
	})

	test('gameTick should call draw', () => {
		loopController.gameTick();
		expect(draw).toHaveBeenCalledTimes(1);
	})
})

describe('LoopController.stop', () => {
	let driver: LoopDriverInterface;
	let loopController: LoopController;
	let clear: () => void;
	let update: () => void;
	let draw: () => void;

	beforeEach(() => {
		driver = {
			start: jest.fn(),
			stop: jest.fn(),
		};
		clear = jest.fn();
		update = jest.fn();
		draw = jest.fn();
		loopController = new LoopController(clear, update, draw, driver);
	});

	test('calling stop should call driver.stop', () => {
		loopController.start();
		loopController.stop();
		expect(driver.stop).toHaveBeenCalledTimes(1);
	})
	test('calling stop should free the controller to call start again', () => {
		loopController.start();
		loopController.stop();
		loopController.start()
		expect(driver.start).toHaveBeenCalledTimes(2);
	})

})
