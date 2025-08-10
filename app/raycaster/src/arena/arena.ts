import { ArenaInterface } from './interface'
import { WallInterface } from '../wall/interface'
import { LineSegment, Dimensions, Coordinates } from '../geometry/interfaces'
import { ColorName } from '../color/color_name'

export class Arena implements ArenaInterface {
	private _walls: Array<WallInterface>;

	constructor(private dimensions: Dimensions) {
		this._walls = new Array<WallInterface>()
		this.drawVerticalLines()
		this.drawHorizontalLines()
	}

	get height(): number {
		//TODO: remove
		return this.dimensions.height;
	}

	get walls(): Array<WallInterface> {
		return this._walls
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

	private drawVerticalLines() {
		const leftStart = { x: 0, y: this.dimensions.height }
		const leftEnd = { x: 0, y: 0 }
		const leftBoundary = this.newWall(leftEnd, leftStart)
		this._walls.push(leftBoundary)

		const rightStart = { x: this.dimensions.width, y: this.dimensions.height }
		const rightEnd = { x: this.dimensions.width, y: 0 }
		const rightBoundary = this.newWall(rightEnd, rightStart)
		this._walls.push(rightBoundary)
	}

	private drawHorizontalLines() {
		const upperStart = { x: 0, y: this.dimensions.height }
		const upperEnd = { x: this.dimensions.width, y: this.dimensions.height }
		const upperBoundary = this.newWall(upperStart, upperEnd)
		this._walls.push(upperBoundary)

		const lowerStart = { x: 0, y: 0 }
		const lowerEnd = { x: this.dimensions.width, y: 0 }
		const lowerBoundary = this.newWall(lowerStart, lowerEnd)
		this._walls.push(lowerBoundary)
	}

	private newWall(start: Coordinates, end: Coordinates): WallInterface {
		return { line: { start, end }, color: ColorName.RED }
	}
}
