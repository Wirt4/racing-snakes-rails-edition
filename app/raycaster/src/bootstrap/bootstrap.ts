
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
	const canvas = document.createElement("canvas");
	canvas.width = settings.CANVAS_WIDTH;
	canvas.height = settings.CANVAS_HEIGHT;
	canvas.id = canvasId;
	document.getElementById("app")?.appendChild(canvas);

	const offscreen = canvas.transferControlToOffscreen();
	const worker = new Worker(workerPath, { type: 'module' });

	worker.postMessage(
		{
			type: "init",
			canvas: offscreen,
			settings,
		},
		[offscreen]
	);

	const listener = new Listener(worker);

	window.addEventListener("keydown", (e: KeyboardEvent) => {
		listener.keydown(e.key);
	});

	window.addEventListener("keyup", (e: KeyboardEvent) => {
		listener.keyup(e.key);
	});
}
