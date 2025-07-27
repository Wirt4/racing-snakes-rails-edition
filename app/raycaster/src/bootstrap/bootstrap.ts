import { Settings } from '../settings/settings';
import { Listener } from '../listener/listener';

export function bootstrap({
	canvasId,
	workerPath,
	settings,
}: {
	canvasId: string;
	workerPath: string;
	settings: Settings;
}): void {
	const canvas = createCanvas(canvasId, settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT);
	const offscreen = canvas.transferControlToOffscreen();
	const worker = createWorker(workerPath);
	postInitMessage(worker, settings, offscreen);
	const listener = new Listener(worker);
	bindInputEvents(listener);
}

function createCanvas(canvasId: string, width: number, height: number): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.id = canvasId;
	canvas.width = width;
	canvas.height = height;
	document.getElementById("app")?.appendChild(canvas);
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
interface InputListener {
	keydown(key: string): void;
	keyup(key: string): void;
}

function bindInputEvents(listener: InputListener): void {
	window.addEventListener("keydown", (e) => listener.keydown(e.key));
	window.addEventListener("keyup", (e) => listener.keyup(e.key));
}
