import { Settings } from './settings/settings';
import { Listener } from './listener/listener';
const canvas = document.createElement("canvas");
const settings = new Settings();
const width = settings.CANVAS_WIDTH;
canvas.width = width;
canvas.height = settings.CANVAS_HEIGHT;
canvas.id = "game-window";
document.getElementById("app")?.appendChild(canvas);

const offscreen = canvas.transferControlToOffscreen();
const addressToCompiledExecutable = '/workers/worker.js'
const worker = new Worker(addressToCompiledExecutable, { type: 'module' });

worker.postMessage({
	type: "init",
	canvas: offscreen,
	settings
}, [offscreen]);

const listener = new Listener(worker);

window.addEventListener("keydown", (e: KeyboardEvent) => {
	listener.keydown(e.key);
});

window.addEventListener("keyup", (e: KeyboardEvent) => {
	listener.keyup(e.key);
});

/**
 * Handles mouse or tap - based events
 * **/
window.addEventListener("click", (e: MouseEvent) => {
	// mouse release not required because click records a full mouse down then mouse up
	listener.click(e.clientX, window.innerWidth);
});
