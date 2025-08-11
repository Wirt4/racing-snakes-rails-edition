import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';
import { WallInterface } from '../wall/interface'
import { Slice } from '../slice/interface'
import { ArenaInterface } from '../arena/interface';

export interface GameMapInterface {
	//gridlines and boundarys should belong to arena
	gridLinesX: LineSegment[];
	gridLinesY: LineSegment[];
	arena: ArenaInterface;
	// trails should belong to each player
	walls: WallInterface[];

	//player should own it's own position, angle and trail
	playerPosition: Coordinates;
	playerAngle: number;
	playerTrail: WallInterface[];
	//castRay should be in it's own class -- gameMap interface should have no knowlege of it
	castRay(angle: number, distance: number): Slice;
	resetIntersections(): void;
	//appendWall makes no sense --- should remove
	appendWall(wall: WallInterface): void;
}

