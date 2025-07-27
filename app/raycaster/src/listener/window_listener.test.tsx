import { Listener } from './listener';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';
import { KeyMapInterface } from '../controls/keymap/interface';

describe('Keydown Tests', () => {
	let mockWorker: Worker;
	let listener: Listener;
	let postMessageSpy: any;
	let keyMap: KeyMapInterface;

	beforeEach(() => {
		mockWorker = { postMessage: jest.fn() } as unknown as Worker;
		keyMap = {
			isMappedKey: jest.fn((key: string) => key === 'ArrowLeft' || key === 'ArrowRight'),
			toDirection: jest.fn((key: string) => {
				if (key === 'ArrowLeft') return Directions.LEFT;
				if (key === 'ArrowRight') return Directions.RIGHT;
				return null;
			})
		} as KeyMapInterface;
		listener = new Listener(mockWorker, keyMap);
		postMessageSpy = jest.spyOn(mockWorker, 'postMessage');;
	});

	test('should turn left', () => {
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.LEFT);

		listener.keydown('left');

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.LEFT
		});
	})

	test('if user hits the same key twice, just call the worker post once', () => {
		const keyStroke = 'ArrowLeft';
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.LEFT);

		listener.keydown(keyStroke);
		listener.keydown(keyStroke);

		expect(postMessageSpy.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }]
		]);
	})

	test('should turn right', () => {
		const keyStroke = 'ArrowRight';
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.RIGHT);

		listener.keydown(keyStroke);

		expect(mockWorker.postMessage).toHaveBeenCalledWith({
			type: 'turn',
			direction: Directions.RIGHT
		});
	})

	test('should turn right after turning left', () => {
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValueOnce(Directions.LEFT)
			.mockReturnValueOnce(Directions.RIGHT);
		listener.keydown('ArrowLeft');
		listener.keydown('ArrowRight');

		expect(postMessageSpy.mock.calls).toEqual([
			[{ type: 'turn', direction: Directions.LEFT }],
			[{ type: 'turn', direction: Directions.RIGHT }]
		]);
	})
	test('shoult not accept any keys other than ArrowLeft or ArrowRight', () => {
		listener.keydown('a');
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(false);

		expect(mockWorker.postMessage).not.toHaveBeenCalled();
	})
	test('can turn left again after releasing arrow left key', () => {
		const keyStroke = 'ArrowLeft';
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.LEFT);

		listener.keydown(keyStroke);
		listener.keyup(keyStroke);
		listener.keydown(keyStroke);
		expect(mockWorker.postMessage).toHaveBeenCalledTimes(2);
	})
	test('the keyups need to match', () => {
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection')
			.mockReturnValueOnce(Directions.LEFT)
			.mockReturnValueOnce(Directions.RIGHT)
			.mockReturnValueOnce(Directions.LEFT);
		listener.keydown('ArrowLeft');
		listener.keyup('ArrowRight');
		listener.keydown('ArrowLeft');
		expect(mockWorker.postMessage).toHaveBeenCalledTimes(1);
	})

})
