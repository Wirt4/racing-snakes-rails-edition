import { PlayerInterface } from '../player/interface';
import { WallInterface } from '../wall/interface'
import { Slice } from '../slice/interface'
import { ArenaInterface } from '../arena/interface';

export interface GameMapInterface {
	arena: ArenaInterface;
	walls: WallInterface[];
	player: PlayerInterface;
	castRay(angle: number, distance: number): Slice;
	resetIntersections(): void;
	appendWall(wall: WallInterface): void;
}

