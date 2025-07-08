import { GameMapInterface, WallInterface } from './interface';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { ColorName } from '../game/color/color_name';

export class GameMap implements GameMapInterface {
	walls: WallInterface[] = [];
	gridLinesX: LineSegment[] = [];
	gridLinesY: LineSegment[] = [];
	playerPosition: Coordinates = { x: 0, y: 0 };
	playerAngle: number = 0;


	constructor(width: number, height: number, boundaryColor: ColorName = ColorName.BLACK, gridCell: number = 2) {
		this.gridLinesX = [];
		this.gridLinesY = [];
		for (let i = gridCell; i <= width; i += gridCell) {
			this.gridLinesX.push(
				{
					start: { x: i, y: 0 },
					end: { x: i, y: height }
				}
			);
		}
		for (let i = gridCell; i <= height; i += gridCell) {
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
			this.initializeWall(left_top, left_bottom, boundaryColor),
			this.initializeWall(left_top, right_top, boundaryColor),
			this.initializeWall(right_top, right_bottom, boundaryColor),
			this.initializeWall(left_bottom, right_bottom, boundaryColor),
		];
	}

	movePlayer(): void {
		// stubbed
		this.playerPosition.x += 0.02;

	}

	turnPlayer(angle: number = 0): void {
		this.playerAngle += angle;
	}

	private initializeWall(start: Coordinates, end: Coordinates, color: ColorName): WallInterface {
		return {
			line: { start, end },
			color
		};
	}

}
