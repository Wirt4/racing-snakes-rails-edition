// test for game loop
import { Settings } from './settings';
import { Directions } from './controls/directions';
const canvas = document.createElement("canvas");
const width = Settings.CANVAS_WIDTH;
canvas.width = width;;
canvas.height = Settings.CANVAS_HEIGHT;
canvas.id = "game-window";
document.getElementById("app")?.appendChild(canvas);

const offscreen = canvas.transferControlToOffscreen();
//below address is from the Ruby view, not relative to the TS system
const worker = new Worker('/workers/worker.js', { type: 'module' });


worker.postMessage({
	type: "init",
	canvas: offscreen,
	settings: Settings
}, [offscreen]);

onkeydown = (e: KeyboardEvent) => {
	if (e.key === "ArrowLeft") {
		worker.postMessage({ type: "turn", direction: Directions.LEFT });
	}
	if (e.key === "ArrowRight") {
		worker.postMessage({ type: "turn", direction: Directions.RIGHT });
	}
}
