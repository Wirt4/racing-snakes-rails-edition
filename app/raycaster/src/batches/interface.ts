import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../gamemap/interface';

interface BatchesInterface {
	clear(): void;
	addWallSlice(color: ColorName, brightness: number, x: number, y: number, height: number): void;
	releaseSlice(rect: BatchedRect): void;
	addGridPoint(origin: Coordinates): void;
	addMapWalls(walls: Array<WallInterface>): void;
	addMapWall(wall: WallInterface): void;
}

interface BatchedRect { x: number, y: number, width: number, height: number };

export { BatchesInterface, BatchedRect }
