import { describe, test, expect } from '@jest/globals';
import { KeyMap } from './keymap';

describe('keymap tests', () => {
	test('isMappedKey is true', () => {
		const keyMap = new KeyMap()
		expect(keyMap.isMappedKey('ArrowLeft')).toBe(true);
	})
})
