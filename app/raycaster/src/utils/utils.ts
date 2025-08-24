import { FULL_CIRCLE } from '../geometry/constants'
import { Coordinates } from '../geometry/interfaces'

function assertIsNumber(value: number): void {
	if (typeof value !== 'number') {
		throw new Error('value must be a number')
	}
}

function assertIsNonNegative(value: number): void {
	assertIsNumber(value)
	if (value < 0) {
		throw new Error("Value must be non-negative");
	}
}

function assertIsPositive(value: number): void {
	assertIsNonNegative(value);
	if (value === 0) {
		throw new Error("Value must be a positive number");
	}
}

function assertIsPositiveInteger(value: number): void {
	assertIsPositive(value);
	if (!Number.isInteger(value)) {
		throw new Error("Value must be an integer");
	}
}

/**
 * Guarantees angles are within a valid range
 * throws if number is not a valid type
 */
function normalizeAngle(angle: number): number {
	// check the input
	assertIsNumber(angle)
	// adjust the angle as necessary if it is less than 0
	let adjustedAngle = angle;
	while (adjustedAngle < 0) {
		adjustedAngle += FULL_CIRCLE
	}
	// adjust the angle as necessary if it is greater or equal to a full circle
	while (adjustedAngle - FULL_CIRCLE >= 0) {
		adjustedAngle -= FULL_CIRCLE;

	}
	// return the adjusted angle
	return adjustedAngle;
}

/**
 * guarantees that coordinates' members are non-negative
 *
 * */
function assertAreNonNegativeCoordinates(coordinates: Coordinates): void {
	try {
		assertIsNonNegative(coordinates.x)
		assertIsNonNegative(coordinates.y)
	}
	catch (error) {
		console.error({ error })
		console.error({ coordinates })
		//if neither of them work, throw an error
		throw new Error(`x and y coordinates must be non-negative`)
	}
}


export { assertIsPositiveInteger, assertIsPositive, assertIsNonNegative, normalizeAngle, assertAreNonNegativeCoordinates };
