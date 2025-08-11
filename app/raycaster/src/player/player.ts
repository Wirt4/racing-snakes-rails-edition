import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../wall/interface';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { ArenaInterface } from '../arena/interface'
import { LineSegment } from '../geometry/interfaces';

interface Point {
	trailIndex: number;
	isLeft: boolean;
	location: Coordinates;
}

interface TreeNode {
	yAxis: number;
	trailIndex: number;
}

interface Neighbors { predecessor: TreeNode | null, successor: TreeNode | null }


export class Player implements PlayerInterface {
	x: number;
	y: number;
	private _trail: WallInterface[] = [];
	private currentHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private isTurning: boolean = false;

	constructor(
		coordinates: Coordinates,
		private speed: number,
		color: ColorName = ColorName.RED,
		private camera: CameraInterface
	) {
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.currentHeading = camera.angle;
		this.lastPosition = { x: this.x, y: this.y };
		const startWall = { line: { start: this.lastPosition, end: this.lastPosition }, color };
		this._trail = [startWall];
		this.color = color;
	}

	get angle(): number {
		return this.camera.angle;
	}

	get trail(): WallInterface[] {
		return this._trail;
	}

	hasCollided(arena: ArenaInterface): boolean {
		// first check if the player is outside the arena
		if (!arena.containsCoordinates(this.x, this.y)) {
			return true;
		}
		// if there's less than 2 segments in the trail, then no collision
		if (this._trail.length < 2) {
			return false;
		}
		// set the trailhead -- it's what is going to be compared
		const trailHead = this._trail[this._trail.length - 1].line;
		const headIsVertical = this.isVertical(trailHead);
		// check every segment except last and penultimate
		for (let i = 0; i < this._trail.length - 2; i++) {
			// if the current  is perpendicular to the last segment, then check for an intersection
			const curSegment = this._trail[i].line;
			const curIsVertical = this.isVertical(curSegment);
			if (headIsVertical !== curIsVertical) {
				// then check for an intersection
				if (headIsVertical && this.isInRange(trailHead, curSegment)
				) {
					return true;
				} else if (!headIsVertical && this.isInRange(curSegment, trailHead)) {
					return true
				}
			}

		}
		return false;
	}

	turnLeft(): void {
		this.turn(Directions.LEFT);
	}

	turnRight(): void {
		this.turn(Directions.RIGHT);
	}

	move(): void {
		this.adjustCamera();
		this.redirectIfTurned();
		this.moveAlongHeading();
	}

	private turn(dir: Directions): void {
		if (!this.isTurning) {
			this.camera.beginTurnExecution(dir);
			this.isTurning = true;
		}
	}

	minY(segment: LineSegment): number {
		return this.cmp(segment, false, Math.min)
	}

	maxY(segment: LineSegment): number {
		return this.cmp(segment, false, Math.max)
	}

	minX(segment: LineSegment): number {
		return this.cmp(segment, true, Math.min)
	}

	maxX(segment: LineSegment): number {
		return this.cmp(segment, true, Math.max)
	}
	private cmp(
		segment: LineSegment,
		isXAxis: boolean,
		cmpFunc: (a: number, b: number) => number
	): number {
		const { start, end } = segment
		return isXAxis ? cmpFunc(start.x, end.x) : cmpFunc(start.y, end.y)
	}

	private redirectIfTurned(): void {
		if (this.cameraTurnHasCompleted() && this.isTurning) {
			this.redirect();
			this.isTurning = false;
		}
	}

	private redirect(): void {
		this.addTrailSegment();
		this.currentHeading = this.camera.angle;
	}

	private adjustCamera(): void {
		if (this.camera.isRotating) {
			this.camera.adjust();
		}
	}

	private addTrailSegment(): void {
		this._trail.push({
			line: {
				start: { x: this.x, y: this.y },
				end: { x: this.x, y: this.y }
			},
			color: this.color
		})
	}

	private cameraTurnHasCompleted(): boolean {
		return !this.camera.isRotating;
	}

	private growTrail(): void {
		this._trail[this._trail.length - 1].line.end = { x: this.x, y: this.y };
	}

	private moveAlongHeading(): void {
		this.x += Math.round(Math.cos(this.currentHeading)) * this.speed;
		this.y += Math.round(Math.sin(this.currentHeading)) * this.speed;

		this.growTrail();
	}

	private isVertical(segment: LineSegment): boolean {
		return segment.start.x === segment.end.x;
	}

	private isInRange(verticalSegment: LineSegment, horizontalSegment: LineSegment): boolean {
		//check if vertical outside horizontal range
		if (verticalSegment.start.x < Math.min(horizontalSegment.start.x, horizontalSegment.end.x)) {
			return false;
		}
		if (verticalSegment.start.x > Math.max(horizontalSegment.start.x, horizontalSegment.end.x)) {
			return false;
		}
		//check if horizontal outside vertical range
		if (horizontalSegment.start.y < Math.min(verticalSegment.start.y, verticalSegment.end.y)) {
			return false;
		}
		return horizontalSegment.start.y <= Math.max(verticalSegment.start.y, verticalSegment.end.y)
	}
}
