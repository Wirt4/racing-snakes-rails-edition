import { describe, test, expect } from '@jest/globals';
import { KeyMap } from './keymap';
import { Directions } from '../directions';

describe('keymap tests', () => {
	test('isMappedKey is true', () => {
		const keyMap = new KeyMap(['ArrowLeft', 'ArrowRight']);
		expect(keyMap.isMappedKey('ArrowLeft')).toBe(true);
		expect(keyMap.isMappedKey('ArrowRight')).toBe(true);
	});

	test('isMappedKey is false', () => {
		const keyMap = new KeyMap(['ArrowLeft', 'ArrowRight']);
		expect(keyMap.isMappedKey('q')).toBe(false);
	})

	test('getMappedKey returns mapped key', () => {
		const keyMap = new KeyMap(['q', 'w']);
		expect(keyMap.toDirection('q')).toBe(Directions.LEFT);
		expect(keyMap.toDirection('w')).toBe(Directions.RIGHT);
	});
})
