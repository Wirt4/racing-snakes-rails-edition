import { GameMapInterface, WallInterface } from './interface';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { ColorName } from '../game/color/color_name';
import { Slice } from '../gamemap/interface';


export class GameMap implements GameMapInterface {
	walls: WallInterface[] = [];
	gridLinesX: LineSegment[] = [];
	gridLinesY: LineSegment[] = [];
	playerPosition: Coordinates = { x: 0, y: 0 };
	playerAngle: number = 0;


	constructor(width: number, height: number, boundaryColor: ColorName = ColorName.BLACK, gridCell: number = 2) {
		this.gridLinesY = this.generateGridLines(gridCell, height, width, true);
		this.gridLinesX = this.generateGridLines(gridCell, width, height, false);
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

	castRay(angle: number): Slice {
		return { distance: 10, color: ColorName.RED, gridHits: null }
	}

	private initializeWall(start: Coordinates, end: Coordinates, color: ColorName): WallInterface {
		return {
			line: { start, end },
			color
		};
	}

	private generateGridLines(step: number, primary: number, secondary: number, isVerical: boolean = false): LineSegment[] {
		const lines: LineSegment[] = [];
		for (let i = step; i <= primary; i += step) {
			if (isVerical) {
				lines.push({
					start: { x: i, y: 0 },
					end: { x: i, y: secondary }
				});
			} else {
				lines.push({
					start: { x: 0, y: i },
					end: { x: secondary, y: i }
				});
			}
		}
		return lines;
	}

}
