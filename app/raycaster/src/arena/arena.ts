import { ArenaInterface } from './interface'
import { WallInterface } from '../wall/interface'
import { LineSegment } from '../geometry/interfaces'
import { Dimensions } from '../geometry/interfaces';

export class Arena implements ArenaInterface {

	constructor(private dimensions: Dimensions) {
	}

	get height(): number {
		//TODO: remove
		return this.dimensions.height;
	}

	get walls(): Array<WallInterface> {
		const walls: Array<WallInterface> = [
			{} as WallInterface,
			{} as WallInterface,
			{} as WallInterface,
			{} as WallInterface];
		return walls;
	}

	get gridLines(): Array<LineSegment> {
		throw new Error('Method not implemented.');
	}

	containsCoordinates(x: number, y: number): boolean {
		if (this.inRange(x, this.dimensions.width)) {
			return this.inRange(y, this.dimensions.height)
		} else {
			return false
		}
	}

	private inRange(coord: number, boundary: number): boolean {
		return 0 <= coord && coord <= boundary
	}
}
