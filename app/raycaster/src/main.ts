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

// onkeydown = (e: KeyboardEvent) => {
// 	if (e.key === "ArrowLeft") {
// 		worker.postMessage({ type: "turn", direction: Directions.LEFT });
// 	}
// 	if (e.key === "ArrowRight") {
// 		worker.postMessage({ type: "turn", direction: Directions.RIGHT });
// 	}
// }

let lastDirection: Directions | null = null;

window.addEventListener("keydown", (e: KeyboardEvent) => {
	let direction: Directions | null = null;
	if (e.key === "ArrowLeft") direction = Directions.LEFT;
	if (e.key === "ArrowRight") direction = Directions.RIGHT;

	// Only post if direction changed
	if (direction !== null && direction !== lastDirection) {
		worker.postMessage({ type: "turn", direction });
		lastDirection = direction;
	}
});

window.addEventListener("keyup", (e: KeyboardEvent) => {
	// Reset only if releasing the same key
	if (
		(e.key === "ArrowLeft" && lastDirection === Directions.LEFT) ||
		(e.key === "ArrowRight" && lastDirection === Directions.RIGHT)
	) {
		lastDirection = null;
	}
});
