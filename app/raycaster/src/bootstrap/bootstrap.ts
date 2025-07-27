import { SettingsInterface } from '../settings/interface';
import { ListenerInterface } from '../listener/listener';

function bootstrap({
	canvasId,
	workerPath,
	settings,
	listenerFactory,
}: {
	canvasId: string;
	workerPath: string;
	settings: SettingsInterface;
	listenerFactory: (worker: Worker) => ListenerInterface;

}): void {
	const offscreenCanvas = createOffscreenCanvas(canvasId, settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT)
	const worker = createWorker(workerPath);
	postInitMessage(worker, settings, offscreenCanvas);
	bindInputEvents(listenerFactory(worker));
}

function createOffscreenCanvas(canvasId: string, width: number, height: number): OffscreenCanvas {
	const canvas = createCanvas(canvasId, width, height);
	document.getElementById("app")?.appendChild(canvas);
	return canvas.transferControlToOffscreen();
}

function createCanvas(canvasId: string, width: number, height: number): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.id = canvasId;
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

function createWorker(workerPath: string): Worker {
	return new Worker(workerPath, { type: 'module' });
}

function postInitMessage(worker: Worker, settings: SettingsInterface, canvas: OffscreenCanvas): void {
	worker.postMessage(
		{
			type: "init",
			canvas,
			settings,
		},
		[canvas]
	);
}

function bindInputEvents(listener: ListenerInterface): void {
	window.addEventListener("keydown", (e) => listener.keydown(e.key));
	window.addEventListener("keyup", (e) => listener.keyup(e.key));
}

export { bootstrap };
