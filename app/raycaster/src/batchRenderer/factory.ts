import { BatchRendererSettings } from './settings';
import { BatchRendererInterface } from './interface';
import { Renderer } from '../renderer/renderer';
import { BatchRenderer } from '../batchRenderer/batchRenderer';
export function batchRendererFactory(settings: BatchRendererSettings, canvas: OffscreenCanvas): BatchRendererInterface {
	const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

	if (!ctx) {
		throw new Error("Failed to get 2D context from OffscreenCanvas");
	}

	return new BatchRenderer(
		new Renderer(ctx),
		settings.CANVAS_WIDTH,
		settings.CANVAS_HEIGHT,
		settings.GRID_COLOR
	);
}
