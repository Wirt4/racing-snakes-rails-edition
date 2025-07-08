import { GameMapInterface, WallInterface } from './interface';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { ColorName } from '../game/color/color_name';

const GRID_CELL = 1; // Size of the grid cells
export class GameMap implements GameMapInterface {
	walls: WallInterface[] = [];
	gridLinesX: LineSegment[] = [];
	gridLinesY: LineSegment[] = [];
	playerPosition: Coordinates = { x: 0, y: 0 };
	playerAngle: number = 0;

	constructor(width: number, height: number, wallColor: ColorName = ColorName.BLACK) {
		this.gridLinesX = [];
		this.gridLinesY = [];
		for (let i = 0; i <= width; i += GRID_CELL) {
			this.gridLinesX.push(
				{
					start: { x: i, y: 0 },
					end: { x: i, y: height }
				}
			);
		}
		for (let i = 0; i <= height; i += GRID_CELL) {
			this.gridLinesY.push(
				{
					start: { x: 0, y: i },
					end: { x: width, y: i }
				}
			)
		}
		this.walls = [{
			line: { start: { x: 0, y: 0 }, end: { x: 0, y: height } },
			color: ColorName.BLACK
		}, {
			line: { start: { x: 0, y: 0 }, end: { x: width, y: 0 } },
			color: ColorName.BLACK
		},
		{
			line: { start: { x: width, y: 0 }, end: { x: width, y: height } },
			color: ColorName.BLACK
		},
		{
			line: { start: { x: 0, y: height }, end: { x: width, y: height } },
			color: ColorName.BLACK
		},

		];
	}

	movePlayer(): void {
		// stubbed
		this.playerPosition.x += 0.02;

	}

	turnPlayer(angle: number = 0): void {
		this.playerAngle += angle;
	}

	// Additional methods for game map functionality can be added here
}
