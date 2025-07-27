import { Listener } from './listener';
import { beforeEach, describe, test, expect, jest } from '@jest/globals';
import { Directions } from '../controls/directions';
import { KeyMapInterface } from '../controls/keymap/interface';
import { DirectionMessengerInterface } from '../directionMessenger/interface';

describe('Keydown Tests', () => {
	let listener: Listener;
	let keyMap: KeyMapInterface;
	let directionMessenger: DirectionMessengerInterface;
	let sendTurnSpy: jest.MockedFunction<any>;

	beforeEach(() => {
		directionMessenger = {
			sendTurn: jest.fn()
		}
		sendTurnSpy = jest.spyOn(directionMessenger, 'sendTurn');
		keyMap = {
			isMappedKey: jest.fn((key: string) => key === 'ArrowLeft' || key === 'ArrowRight'),
			toDirection: jest.fn((key: string) => {
				if (key === 'ArrowLeft') return Directions.LEFT;
				if (key === 'ArrowRight') return Directions.RIGHT;
				return null;
			})
		} as KeyMapInterface;
		listener = new Listener(keyMap, directionMessenger);
	});

	test('should turn left', () => {
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.LEFT);

		listener.keydown('left');
		expect(directionMessenger.sendTurn).toHaveBeenCalledWith(Directions.LEFT);
	});
	test('if user hits the same key twice, just call the worker post once', () => {
		const keyStroke = 'ArrowLeft';
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.LEFT);

		listener.keydown(keyStroke);
		listener.keydown(keyStroke);

		expect(sendTurnSpy.mock.calls).toEqual([
			[Directions.LEFT]
		]);
	})

	test('should turn right', () => {
		const keyStroke = 'ArrowRight';
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.RIGHT);

		listener.keydown(keyStroke);

		expect(directionMessenger.sendTurn).toHaveBeenCalledWith(Directions.RIGHT);
	})

	test('should turn right after turning left', () => {
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValueOnce(Directions.LEFT)
			.mockReturnValueOnce(Directions.RIGHT);

		listener.keydown('ArrowLeft');
		listener.keydown('ArrowRight');

		expect(sendTurnSpy.mock.calls).toEqual([
			[Directions.LEFT],
			[Directions.RIGHT]
		]);
	})
	test('shoult not accept any keys other than ArrowLeft or ArrowRight', () => {
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(false);

		listener.keydown('a');

		expect(directionMessenger.sendTurn).not.toHaveBeenCalled();
	})
	test('can turn left again after releasing arrow left key', () => {
		const keyStroke = 'ArrowLeft';
		jest.spyOn(keyMap, 'isMappedKey').mockReturnValue(true);
		jest.spyOn(keyMap, 'toDirection').mockReturnValue(Directions.LEFT);

		listener.keydown(keyStroke);
		listener.keyup(keyStroke);
		listener.keydown(keyStroke);

		expect(directionMessenger.sendTurn).toHaveBeenCalledTimes(2);
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

		expect(directionMessenger.sendTurn).toHaveBeenCalledTimes(1);
	})
})
