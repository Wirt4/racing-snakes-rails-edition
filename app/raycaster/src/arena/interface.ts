import { LineSegment } from '../geometry/interfaces';
import { WallInterface } from '../wall/interface';

export interface ArenaInterface {
	height: number;
	containsCoordinates(x: number, y: number): boolean;
	gridLines: Array<LineSegment>;
	walls: Array<WallInterface>;
}
