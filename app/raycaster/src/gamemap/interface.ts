import { Coordinates, LineSegment } from '../geometry/interfaces';
import { PlayerInterface } from '../player/interface';
import { WallInterface } from '../wall/interface'
import { Slice } from '../slice/interface'
import { ArenaInterface } from '../arena/interface';

export interface GameMapInterface {
	//gridlines and boundarys should belong to arena
	arena: ArenaInterface;
	// trails should belong to each player
	walls: WallInterface[];

	player: PlayerInterface;
	//castRay should be in it's own class -- gameMap interface should have no knowlege of it
	castRay(angle: number, distance: number): Slice;
	resetIntersections(): void;
	//appendWall makes no sense --- should remove
	appendWall(wall: WallInterface): void;
}

