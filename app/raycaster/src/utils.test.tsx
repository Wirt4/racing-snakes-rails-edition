
import { describe, test, expect, } from '@jest/globals';
import { normalizeAngle } from './utils'
describe('normalizeAngle', () => {
	test("if input is 2 pi, return 0", () => {
		expect(normalizeAngle(2 * Math.PI)).toEqual(0)
	})
	test("if input is between 0 and 2PI, do not alter it", () => {
		expect(normalizeAngle(Math.PI)).toEqual(Math.PI)
	})
	test("if there's oversweep, normalize to inside 0 and 2PI", () => {
		expect(normalizeAngle(9 * Math.PI / 4)).toEqual(Math.PI / 4)
	})
	test("if input is negative, normalize to inside 0 and 2PI", () => {
		expect(normalizeAngle(-Math.PI / 4)).toEqual(7 * Math.PI / 4)
	})
})
