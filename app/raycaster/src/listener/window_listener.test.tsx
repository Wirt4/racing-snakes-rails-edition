import { Listener } from './listener';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';

type PostSpy = jest.SpiedFunction<Worker['postMessage']>

describe('click tests', () => {
	//before each test ...
	let mockWorker: Worker;
	let listener: Listener;
	let spy: PostSpy;
	let assertThrows: Function;

	//assert throws
	//hides: callback nonsense, 
	//preconditions: listener is instantiated
	//postconditions assert...toThrow is called
	//outputs - none
	//inputs - x and width arguments, both numbers
	/***
	 * nicety
	 */

	beforeEach(() => {
		mockWorker = createMockWorker()
		spy = createSpy(mockWorker)
		listener = new Listener(mockWorker)
		/***
		 * a DRY function to encapsulate callbacks
		 * */
		assertThrows = (x: number, width: number) => {
			//calls click inside an arrow method
			const wrapper = () => { listener.click(x, width) }
			//asserts if it throws
			expect(wrapper).toThrow()
		}

	});

	test('calling click with x or width less than 0 should throw', () => {
		assertThrows(-1, 100)
		assertThrows(10, -1)
		expect(() => listener.click(-1, 100)).toThrow()
		expect(() => listener.click(10, -1)).toThrow()
	});

	test('calling click with x greater than width should throw', () => {
		assertThrows(40, 39)
	});
	// calling click with x less than 1/2 width should post a turn left message
	// calling click with x greater than 1/2 width should post a turn right message
	// when width is odd and x is dead center, should default to calling turn right
})

describe('Keydown Tests', () => {
	let mockWorker: Worker;
	let listener: Listener;
	let postMessageSpy: PostSpy;

	beforeEach(() => {
		mockWorker = createMockWorker();
		listener = new Listener(mockWorker);
		postMessageSpy = createSpy(mockWorker);
	});

	test('should turn left', () => {
		const keyStroke = 'ArrowLeft';
		listener.keydown(keyStroke);
		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.LEFT
		});
	})

	test('if user hits the same key twice, just call the worker post once', () => {
		const keyStroke = 'ArrowLeft';
		listener.keydown(keyStroke);
		listener.keydown(keyStroke);
		expect(postMessageSpy.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }]
		]);
	})

	test('should turn right', () => {
		const keyStroke = 'ArrowRight';
		listener.keydown(keyStroke);
		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.RIGHT
		});
	})

	test('should turn right after turning left', () => {
		listener.keydown('ArrowLeft');
		listener.keydown('ArrowRight');
		expect(postMessageSpy.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }],
			[{ type: 'turn', direction: Directions.RIGHT }]
		]);
	})

	test('should not turn if the same key is pressed twice', () => {
		listener.keydown('ArrowLeft');
		listener.keydown('ArrowLeft');
		expect(postMessageSpy.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }]
		]);
	})

	test('shoult not accept any keys other than ArrowLeft or ArrowRight', () => {
		listener.keydown('a');
		expect(mockWorker.postMessage).not.toHaveBeenCalled();
	})

	test('can turn left again after releasing arrow left key', () => {
		const keyStroke = 'ArrowLeft';
		listener.keydown(keyStroke);
		listener.keyup(keyStroke);
		listener.keydown(keyStroke);
		expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
	})

	test('the keyups need to match', () => {
		listener.keydown('ArrowLeft');
		listener.keyup('ArrowRight');
		listener.keydown('ArrowLeft');
		expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
	})
})

/**
 * creates a mocked worker object suitable for testing
 */
function createMockWorker(): Worker {
	const postMessage = jest.fn()
	//assumes postMessage is the only worker asset used by listener
	return { postMessage } as unknown as Worker;
}

/**
 * creates a spy for worker's postMessage method
 */
function createSpy(worker: Worker): PostSpy {
	const methodName = 'postMessage';
	// preconditions-- worker has a method "postMessage"
	if (!(methodName in worker)) {
		throw new Error(`${methodName} is not in argument`)
	}

	return jest.spyOn(worker, methodName);
}



