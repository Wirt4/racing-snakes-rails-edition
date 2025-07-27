import { describe, test, expect } from '@jest/globals';
import { KeyMap } from './keymap';

describe('keymap tests', () => {
	test('isMappedKey is true', () => {
		const keyMap = new KeyMap('ArrowLeft');
		expect(keyMap.isMappedKey('ArrowLeft')).toBe(true);
	});

	test('isMappedKey is false', () => {
		const keyMap = new KeyMap('ArrowLeft');
		expect(keyMap.isMappedKey('q')).toBe(false);
	})
})
