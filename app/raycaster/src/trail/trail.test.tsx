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

})
