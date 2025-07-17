import { Coordinates, LineSegment } from '../geometry/interfaces';
import { ColorName } from '../color/color_name';

interface WallInterface {
	line: LineSegment;
	color: ColorName
}

interface Slice {
	distance: number;
	color: ColorName;
	gridHits: number[];
	intersection: Coordinates;
}

interface GameMapInterface {
	walls: WallInterface[];
	gridLinesX: LineSegment[];
	gridLinesY: LineSegment[];
	playerPosition: Coordinates;
	playerAngle: number;
	playerTrail: WallInterface[];
	movePlayer(): void;
	prepareFrame(): void;
	turnPlayer(angle: number): void;
	castRay(angle: number, maximumAllowableDistance: number): Slice;
	appendWall(wall: WallInterface): void;
}

export { GameMapInterface, WallInterface, Slice };
