// test for game loop
import { Settings } from './settings';
import { ColorName } from './game/color/color_name';
import { GameMap } from './gamemap/map';

const canvas = document.createElement("canvas");
const width = Settings.CANVAS_WIDTH;
canvas.width = width;;
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

const gameMapSize = { width: 1000, height: 1000 };
const gameMap = new GameMap(gameMapSize, ColorName.GREEN, 5, { rotate: () => { }, move: () => { }, x: 1, y: 1, angle: 0 });
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

onkeydown = (e: KeyboardEvent) => {
	if (e.key === "ArrowLeft") {
		worker.postMessage({ type: "turn", direction: "left" });
	}
}
