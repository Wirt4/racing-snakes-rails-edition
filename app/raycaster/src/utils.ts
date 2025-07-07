function assertIsPositiveInteger(value: number): void {
	if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
		throw new Error("Value must be a positive integer");
	}
}
export { assertIsPositiveInteger };
