import { describe, expect, jest, test } from '@jest/globals';
import { bootstrap } from './bootstrap';

const mockCreateElement = jest.fn();

describe('bootstrap function', () => {
	test('initializes canvas and appends it to the DOM', () => {

		bootstrap();

		expect(mockCreateElement).toHaveBeenCalledWith('canvas');
	});
})
