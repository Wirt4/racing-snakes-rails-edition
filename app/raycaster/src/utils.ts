function assertIsNonNegative(value: number): void {
	if (typeof value !== 'number' || value < 0) {
		throw new Error("Value must be a non-negative number");
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
export { assertIsPositiveInteger, assertIsPositive, assertIsNonNegative };
