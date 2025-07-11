// test for game loop
import { Settings } from './settings';
import { ColorName } from './game/color/color_name';
import { GameMap } from './gamemap/map';

const canvas = document.createElement("canvas");
canvas.width = Settings.CANVAS_WIDTH;
canvas.height = Settings.CANVAS_HEIGHT;
canvas.id = "game-window";
document.getElementById("app")?.appendChild(canvas);

const offscreen = canvas.transferControlToOffscreen();
//below address is from the Ruby view, not relative to the TS system
const worker = new Worker('/workers/worker.js', { type: 'module' });
const walls = [];
for (let i = 0; i < 10; i++) {
	walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 100 }, end: { x: 10 * i, y: 55 } } })
	if (i % 2 == 0) {
		walls.push({ color: ColorName.RED, line: { start: { x: 10 * i, y: 55 }, end: { x: 10 * (i + 1), y: 55 } } })
	}
}
walls.push({ color: ColorName.YELLOW, line: { start: { x: 0, y: 40 }, end: { x: 100, y: 40 } } })

const gameMap = new GameMap(1000, 1000, ColorName.GREEN);
gameMap.playerAngle = 0
gameMap.playerPosition = { x: 20, y: 54 };
gameMap.walls = [...walls, ...gameMap.walls];

worker.postMessage({
	type: "init",
	canvas: offscreen,
	settings: Settings,
	mapData: {
		playerPosition: gameMap.playerPosition,
		playerAngle: gameMap.playerAngle,
		walls: gameMap.walls,
	},
}, [offscreen]);

//mouse detesction
let isDragging = false;
let lastX: number | null = null;

canvas.addEventListener("mousedown", (e) => {
	isDragging = true;
	lastX = e.clientX;
});

canvas.addEventListener("mouseup", () => {
	isDragging = false;
	lastX = null;
});

canvas.addEventListener("mouseleave", () => {
	isDragging = false;
	lastX = null;
});

canvas.addEventListener("mousemove", (e) => {
	if (!isDragging || lastX === null) return;

	const deltaX = e.clientX - lastX;
	lastX = e.clientX;

	const sensitivity = 0.005; // tweak for feel
	const turnDelta = deltaX * sensitivity;

	worker.postMessage({ type: "mouseTurn", angleDelta: turnDelta });
});

