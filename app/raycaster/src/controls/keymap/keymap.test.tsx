import { describe, test, expect } from '@jest/globals';
import { KeyMap } from './keymap';

describe('keymap tests', () => {
	test('isMappedKey is true', () => {
		const keyMap = new KeyMap(['ArrowLeft', 'ArrowRight']);
		expect(keyMap.isMappedKey('ArrowLeft')).toBe(true);
		expect(keyMap.isMappedKey('ArrowRight')).toBe(true);
	});

	test('isMappedKey is false', () => {
		const keyMap = new KeyMap(['ArrowLeft']);
		expect(keyMap.isMappedKey('q')).toBe(false);
	})
})
