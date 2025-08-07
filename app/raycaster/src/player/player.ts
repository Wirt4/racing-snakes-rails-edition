import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../wall/interface';
import { BMath } from '../boundedMath/bmath';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { ArenaInterface } from '../arena/interface'
import PriorityQueue from 'ts-priority-queue'
class Player implements PlayerInterface {
	x: number;
	y: number;
	private _trail: WallInterface[] = [];
	private currentHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private bMath: BMath = BMath.getInstance();
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
		//if player exited arena, then true
		if (!arena.containsCoordinates(this.x, this.y)) {
			return true;
		}

		const heap = this.createMinXCoordHeap()
		// 	create a BST for this.bst
		// 	while the heap isn't empty
		// 		remove a point from the heap
		// 		if hasIntersection(point), then return true and break
		return false
	}


	turnLeft(): void {
		this.turn(Directions.LEFT);
	}

	turnRight(): void {
		this.turn(Directions.RIGHT);
	}

	move(): void {
		this.adjustCamera();
		this.moveAlongHeading();
		this.redirectIfTurned();
	}

	private turn(dir: Directions): void {
		if (!this.isTurning) {
			this.camera.beginTurnExecution(dir);
			this.isTurning = true;
		}
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
		this._trail.push({ line: { start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y } }, color: this.color })
	}

	private cameraTurnHasCompleted(): boolean {
		return !this.camera.isRotating;
	}

	private growTrail(): void {
		this._trail[this._trail.length - 1].line.end = { x: this.x, y: this.y };
	}

	private moveAlongHeading(): void {
		this.x += Math.round(this.bMath.cos(this.currentHeading)) * this.speed;
		this.y += this.bMath.sin(this.currentHeading) * this.speed;
		this.growTrail();
	}
	private createMinXCoordHeap(): PriorityQueue<Point> {
		//create a heap based on min x values
		const heap = new PriorityQueue({ comparator: function(a: Point, b: Point) { return b.location.x - a.location.x; } })
		//
		//iterate through the trail
		//	add deriveLeftPoint(segment, currentIndex) to heap
		//	add deriveRightPoint(segment, currentIndex) to heap
		return heap

	}

	//deriveLeftPoint(segment, index)
	//	create pointFromIndex(index)
	//	set point isLeft to true
	//	if segment's start x preceeds segments's end x
	//		set the point's coordinates to segment's start
	//	otherwise
	//		set the points's coordinates to segment's end
	//	return the point

	//deriveRightPoint(segment, index)
	//	create pointFromIndex(index)
	//	set point isLeft to false
	//	if segment's start x preceeds segments's end x
	//		set the point's coordinates to segment's end
	//	otherwise
	//		set the points's coordinates to segment's start
	//	return the point



	//pointFromIndex(index)
	//	create a point object
	//	set the points segment index to index
	//	return the point

}

interface Point {
	// 	segmentIndex number
	// 	isLeft bool
	location: Coordinates;
}

export { Player };
