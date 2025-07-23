import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../gamemap/interface';
import { BatchedRect } from './rectInterface';
interface BatchesInterface {
	clear(): void;
	addWallSlice(color: ColorName, brightness: number, x: number, y: number, height: number): void;
	releaseSlice(rect: BatchedRect): void;
	addGridPoint(origin: Coordinates): void;
	addMapWalls(walls: Array<WallInterface>): void;
	addMapWall(wall: WallInterface): void;
}


export { BatchesInterface, }
