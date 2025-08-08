import { ArenaInterface } from './interface'

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

	get width(): number {
		return this._width;
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
