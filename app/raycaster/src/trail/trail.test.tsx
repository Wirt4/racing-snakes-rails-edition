import { describe, beforeEach, test, expect } from '@jest/globals'
import { Trail } from './trail'

describe('trail tests', () => {
	let trail: Trail

	beforeEach(() => {
		trail = new Trail()
	})

	test('trail can not interesect with itself when first created', () => {
		expect(trail.hasIntersected()).toBe(false)
	})

	test('trail intersects', () => {
		[{ x: 1, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 2 }].forEach(coords => {
			trail.add(coords)
			expect(trail.hasIntersected()).toBe(false)
		})
	})
})
