import { describe, test, expect, jest } from '@jest/globals';
import { BatchRenderer } from './batchRenderer';
import { ContextRendererInterface } from '../renderer/interface';
import { ColorName } from '../color/color_name';
describe('BatchRenderer.clear() test', () => {
	test('given a BatchRenderer instance, when clear is called, then it should call renderer.reset', () => {
		const mockContextRenderer: ContextRendererInterface = {
			reset: () => { }
		} as ContextRendererInterface;
		const resetSpy = jest.spyOn(mockContextRenderer, 'reset')
		const batchRenderer = new BatchRenderer(mockContextRenderer, 800, 600, ColorName.WHITE);

		batchRenderer.clear()

		expect(resetSpy).toHaveBeenCalledTimes(1);
	})
});
