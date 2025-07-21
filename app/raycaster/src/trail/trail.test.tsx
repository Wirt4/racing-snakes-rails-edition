import { describe, test, expect, beforeEach } from '@jest/globals';
import { Trail } from './trail';
import { ColorName } from '../color/color_name';

describe('Trail object tests', () => {
	test('object creation', () => {
		const trail = new Trail(0, 0, ColorName.RED);
		expect(trail.head).toEqual({ x: 0, y: 0 });
		expect(trail.tail).toEqual({ x: 0, y: 0 });
		expect(trail.color).toEqual(ColorName.RED);
	})
	test('object creation', () => {
		const trail = new Trail(5, 5, ColorName.BLUE);
		expect(trail.head).toEqual({ x: 5, y: 5 });
		expect(trail.tail).toEqual({ x: 5, y: 5 });
		expect(trail.color).toEqual(ColorName.BLUE);
	})
})

describe('append test', () => {
	let trail: Trail;
	beforeEach(() => {
		trail = new Trail(0, 0, ColorName.RED);
	})
	test('append to trail', () => {
		trail.append(1, 1);
		expect(trail.head).toEqual(expect.objectContaining({ x: 1, y: 1 }));
		expect(trail.tail).toEqual(expect.objectContaining({ x: 0, y: 0 }));
	})
})
