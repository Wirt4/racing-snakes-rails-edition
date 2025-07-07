import { Angle } from './angle';
import { describe, test, expect } from '@jest/globals';

describe('Angle', () => {
	test('defaults to a measurement in radians', () => {
		const r = Math.PI / 2;
		expect(new Angle(r).radians).toBe(r);
	})
})
