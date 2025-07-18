// test for game loop
import { Settings } from './settings';
import { Directions } from './controls/directions';
const canvas = document.createElement("canvas");
const width = Settings.CANVAS_WIDTH;
canvas.width = width;
canvas.height = Settings.CANVAS_HEIGHT;
canvas.id = "game-window";
document.getElementById("app")?.appendChild(canvas);

const offscreen = canvas.transferControlToOffscreen();
const addressToCompiledExecutable = '/workers/worker.js'
const worker = new Worker(addressToCompiledExecutable, { type: 'module' });

worker.postMessage({
	type: "init",
	canvas: offscreen,
	settings: Settings
}, [offscreen]);

let lastDirection: Directions | null = null;

function postIfDirectionChanged(direction: Directions | null) {
	if (direction !== lastDirection) {
		worker.postMessage({ type: "turn", direction });
		lastDirection = direction;
	}
}

window.addEventListener("keydown", (e: KeyboardEvent) => {
	let direction: Directions | null = null;
	if (e.key === "ArrowLeft") direction = Directions.LEFT;
	if (e.key === "ArrowRight") direction = Directions.RIGHT;
	postIfDirectionChanged(direction);
});

function IsReleasingSameKey(keyStroke: string): boolean {
	if (keyStroke == "ArrowLeft" && lastDirection === Directions.LEFT) {
		return true
	}
	return keyStroke === "ArrowRight" && lastDirection === Directions.RIGHT
}

function resetDirection() {
	lastDirection = null;
}

window.addEventListener("keyup", (e: KeyboardEvent) => {
	if (IsReleasingSameKey(e.key)) {
		resetDirection()
	}
});
