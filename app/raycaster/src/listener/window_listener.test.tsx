import { Listener } from './listener';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';

type PostSpy = jest.SpiedFunction<Worker['postMessage']>

describe('click tests', () => {
	//before each test ...
	let mockWorker: Worker;
	let listener: Listener;
	let spy: PostSpy;

	beforeEach(() => {
		mockWorker = createMockWorker()
		spy = createSpy(mockWorker)
		listener = new Listener(mockWorker)
	});

	test('calling click with x or width less than 0 should throw', () => {
		assertClickThrows(listener, -1, 100)
		assertClickThrows(listener, 10, -1)
	});

	test('calling click with x greater than width should throw', () => {
		assertClickThrows(listener, 40, 39)
	});

	test("calling click with x less than 1/2 width should post a turn left message", () => {
		// confirm calling the method with x: 9 and width: 100 does not throw
		const xCoordinate = 9;
		const width = 100;
		assertClickDoesntThrow(listener, xCoordinate, width)
		listener.click(xCoordinate, width)
		assertTurnCalledWith(spy, Directions.LEFT)
	})

	test("calling click with x greater than 1/2 width should post a turn right message", () => {
		// x is 750
		const x = 750
		// width is 1000
		const width = 1000

		// the method should not throw
		assertClickDoesntThrow(listener, x, width)
		listener.click(x, width)
		// assert called with right
		assertTurnCalledWith(spy, Directions.RIGHT)
	})

	test("when width is odd and x is dead center, should default to calling turn right", () => {
		//width is 6, which is odd if include zero index
		const width = 6
		//x is 3, which puts coordinates 0, 1, 2, on one side and 4, 5, 6 on the other
		const x = 3
		//assumes window displays with upper bound inclusive
		// assert the method doesn't throw
		assertClickDoesntThrow(listener, x, width)
		// call the method
		listener.click(x, width)
		// assert turn is called with right
		assertTurnCalledWith(spy, Directions.RIGHT)
	})
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
		assertTurnCalledWith(postMessageSpy, Directions.LEFT)
	})

	test('if user hits the same key twice, just call the worker post once', () => {
		const keyStroke = 'ArrowLeft';
		listener.keydown(keyStroke);
		listener.keydown(keyStroke);
		assertMutlipleTurnsCalledWith(postMessageSpy, [Directions.LEFT])
	})

	test('should turn right', () => {
		const keyStroke = 'ArrowRight';
		listener.keydown(keyStroke);
		assertTurnCalledWith(postMessageSpy, Directions.RIGHT)
	})

	test('should turn right after turning left', () => {
		listener.keydown('ArrowLeft');
		listener.keydown('ArrowRight');
		assertMutlipleTurnsCalledWith(postMessageSpy, [Directions.LEFT, Directions.RIGHT])
	})

	test('should not turn if the same key is pressed twice', () => {
		listener.keydown('ArrowLeft');
		listener.keydown('ArrowLeft');
		assertMutlipleTurnsCalledWith(postMessageSpy, [Directions.LEFT])
	});

	test('shoult not accept any keys other than ArrowLeft or ArrowRight', () => {
		listener.keydown('a');
		expect(postMessageSpy).not.toHaveBeenCalled();
	})

	test('can turn left again after releasing arrow left key', () => {
		const keyStroke = 'ArrowLeft';
		listener.keydown(keyStroke);
		listener.keyup(keyStroke);
		listener.keydown(keyStroke);
		expect(postMessageSpy).toHaveBeenCalledTimes(2);
	})

	test('the keyups need to match', () => {
		listener.keydown('ArrowLeft');
		listener.keyup('ArrowRight');
		listener.keydown('ArrowLeft');
		expect(postMessageSpy).toHaveBeenCalledTimes(1);
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

/**
 * determines if the spy has been called with correct direction and invariant arguments
 * **/
function assertTurnCalledWith(spy: PostSpy, direction: Directions): void {
	//create the payload
	const payload = { type: "turn", direction }
	//expect that the spy was called with the payload
	expect(spy).toHaveBeenCalledWith(payload)
}

/**
 * given an array of directions, this method checks them with the call record of the spy in order
 */
function assertMutlipleTurnsCalledWith(spy: PostSpy, directions: Array<Directions>): void {
	//build an array of payloads
	const payloads = directions.map((direction) => {
		return [{ type: "turn", direction }]
	})
	// assert the spy's call array equals the payloads
	expect(spy.mock.calls).toEqual(payloads)
}


/***
 * a couple of DRY functions to encapsulate callbacks
 * */
function assertClickWrapper(listener: Listener, x: number, width: number): () => void {
	return () => { listener.click(x, width) }
}

/**
 * encapsulation of confirming method throws
 */
function assertClickThrows(listener: Listener, x: number, width: number): void {
	//calls click inside an arrow method
	const wrapper = assertClickWrapper(listener, x, width)
	//asserts if it throws
	expect(wrapper).toThrow()
}

/**
 * encapsulation of confirming method does not throw
 */
function assertClickDoesntThrow(listener: Listener, x: number, width: number): void {
	//calls click inside an arrow method
	const wrapper = assertClickWrapper(listener, x, width)
	//asserts if it throws
	expect(wrapper).not.toThrow()
}

