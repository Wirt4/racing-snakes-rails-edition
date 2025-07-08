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
		const left_top = { x: 0, y: 0 };
		const left_bottom = { x: 0, y: height };
		const right_top = { x: width, y: 0 };
		const right_bottom = { x: width, y: height };

		this.walls = [
			this.initializeWall(left_top, left_bottom),
			this.initializeWall(left_top, right_top),
			this.initializeWall(right_top, right_bottom),
			this.initializeWall(left_bottom, right_bottom),
		];
	}

	movePlayer(): void {
		// stubbed
		this.playerPosition.x += 0.02;

	}

	turnPlayer(angle: number = 0): void {
		this.playerAngle += angle;
	}

	private initializeWall(start: Coordinates, end: Coordinates): WallInterface {
		return {
			line: { start, end },
			color: ColorName.BLACK
		};
	}

	// Additional methods for game map functionality can be added here
}
