import { FULL_CIRCLE } from './geometry/constants';
function assertIsNonNegative(value) {
    if (typeof value !== 'number' || value < 0) {
        throw new Error("Value must be a non-negative number");
    }
}
function assertIsPositive(value) {
    assertIsNonNegative(value);
    if (value === 0) {
        throw new Error("Value must be a positive number");
    }
}
function assertIsPositiveInteger(value) {
    assertIsPositive(value);
    if (!Number.isInteger(value)) {
        throw new Error("Value must be an integer");
    }
}
function normalizeAngle(angle) {
    return angle < 0 ? angle % FULL_CIRCLE + FULL_CIRCLE : angle % FULL_CIRCLE;
}
export { assertIsPositiveInteger, assertIsPositive, assertIsNonNegative, normalizeAngle };
