import { describe, test, expect } from '@jest/globals';
import { Trail } from './trail';
import { ColorName } from '../color/color_name';
describe('Trail object tests', () => {
	test('object creation', () => {
		const trail = new Trail(0, 0, ColorName.RED);
		expect(trail.head).toEqual({ x: 0, y: 0 });
		expect(trail.tail).toEqual({ x: 0, y: 0 });
		expect(trail.color).toEqual(ColorName.RED);
	})
})
