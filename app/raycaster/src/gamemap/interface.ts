import { PlayerInterface } from '../player/interface';
import { WallInterface } from '../wall/interface'
import { ArenaInterface } from '../arena/interface';

export interface GameMapInterface {
	arena: ArenaInterface;
	walls: WallInterface[];
	player: PlayerInterface;
	resetIntersections(): void;
	appendWall(wall: WallInterface): void;
}

