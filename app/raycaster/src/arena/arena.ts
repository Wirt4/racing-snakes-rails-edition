import { ArenaInterface } from './interface'
import { WallInterface } from '../wall/interface'
import { LineSegment } from '../geometry/interfaces'

export class Arena implements ArenaInterface {
	private _height: number;
	private _width: number;

	constructor(height: number, width: number) {
		this._height = height;
		this._width = width;
	}
	get height(): number {
		return this._height;
	}


	get walls(): Array<WallInterface> {
		throw new Error('Method not implemented.');
	}

	get gridLines(): Array<LineSegment> {
		throw new Error('Method not implemented.');
	}

	containsCoordinates(x: number, y: number): boolean {
		if (this.inRange(x, this._width)) {
			return this.inRange(y, this._height)
		} else {
			return false
		}
	}

	private inRange(coord: number, boundary: number): boolean {
		return 0 <= coord && coord <= boundary
	}
}
