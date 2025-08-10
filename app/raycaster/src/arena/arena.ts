import { ArenaInterface } from './interface'
import { WallInterface } from '../wall/interface'
import { LineSegment, Dimensions, Coordinates } from '../geometry/interfaces'
import { ColorName } from '../color/color_name'

export class Arena implements ArenaInterface {
	private _walls: Array<WallInterface> = []
	private upperLeft: Coordinates = { x: 0, y: 0 }
	private upperRight: Coordinates
	private lowerLeft: Coordinates
	private lowerRight: Coordinates
	private _gridLines: Array<LineSegment> = []

	constructor(
		private dimensions: Dimensions,
		private cellSize: number
	) {
		this.upperRight = { x: this.dimensions.width, y: 0 }
		this.lowerLeft = { x: 0, y: this.dimensions.height }
		this.lowerRight = { x: this.dimensions.width, y: this.dimensions.height }

		this.drawVerticalLines()
		this.drawHorizontalLines()
		this.drawGridLines(cellSize)
	}

	get height(): number {
		//TODO: remove
		return this.dimensions.height;
	}

	get walls(): Array<WallInterface> {
		return this._walls
	}

	get gridLines(): Array<LineSegment> {
		return this._gridLines
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
		const leftEnd = this.lowerLeft
		const leftStart = this.upperLeft
		const leftBoundary = this.newWall(leftStart, leftEnd)
		this._walls.push(leftBoundary)

		const rightStart = this.upperRight
		const rightEnd = this.lowerRight
		const rightBoundary = this.newWall(rightStart, rightEnd)
		this._walls.push(rightBoundary)
	}

	private drawHorizontalLines() {
		const upperStart = this.upperLeft
		const upperEnd = this.upperRight
		const upperBoundary = this.newWall(upperStart, upperEnd)
		this._walls.push(upperBoundary)

		const lowerStart = this.lowerLeft
		const lowerEnd = this.lowerRight
		const lowerBoundary = this.newWall(lowerStart, lowerEnd)
		this._walls.push(lowerBoundary)
	}

	private newWall(start: Coordinates, end: Coordinates): WallInterface {
		return { line: { start, end }, color: ColorName.RED }
	}

	private drawGridLines(cellSize: number): void {
		// if the cell size is larger or equal to than the arena dimensions, no grid lines can be drawn
		if (cellSize >= this.dimensions.width || cellSize >= this.dimensions.height) {
			return;
		}
		this._gridLines = [
			{
				start: { x: 0, y: 0 },
				end: { x: 0, y: 0 }
			},
			{ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }
		];
	}
}
