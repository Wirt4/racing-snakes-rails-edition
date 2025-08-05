import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';
import { WallInterface } from '../wall/interface'
import { Slice } from '../slice/interface'

export interface GameMapInterface {
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

