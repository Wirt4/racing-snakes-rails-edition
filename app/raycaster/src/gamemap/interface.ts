import { Coordinates, LineSegment } from '../geometry/interfaces';
import { ColorName } from '../color/color_name';
import { PlayerInterface } from '../player/interface';


interface Slice {
	distance: number;
	color: ColorName;
	/**
	 * TODO: grid hits seems ineligant, 
	 * should be able to calculate the intervals from some kind of modulus operation in the batcher
	 * **/
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
	castRay(angle: number, distance: number): Slice;
	resetIntersections(): void;
	appendWall(wall: WallInterface): void;
	hasCollidedWithWall(player: PlayerInterface): boolean;
}

export { GameMapInterface, WallInterface, Slice };
