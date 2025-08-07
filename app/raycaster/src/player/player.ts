import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../wall/interface';
import { BMath } from '../boundedMath/bmath';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { ArenaInterface } from '../arena/interface'
import PriorityQueue from 'ts-priority-queue'
import { BalancedTree, BalancedNode } from 'data-balanced-tree';
import { LineSegment } from '../geometry/interfaces';

interface Point {
	segmentIndex: number;
	isLeft: boolean;
	location: Coordinates;
}

interface TreeNode {
	yAxis: number;
	segment: LineSegment;
}

interface Neighbors { predecessor: LineSegment | null, successor: LineSegment | null }


export class Player implements PlayerInterface {
	x: number;
	y: number;
	private _trail: WallInterface[] = [];
	private currentHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private bMath: BMath = BMath.getInstance();
	private isTurning: boolean = false;
	private bst: BalancedTree<TreeNode> = this.intitiateTree();

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
		//prepare for the sweep line algorithm
		const heap = this.createMinXCoordHeap()
		this.bst = this.intitiateTree();
		//iterate through the line segments in a left-to-right sweep
		let result = false
		while (heap.length > 0) {
			const point = heap.dequeue();
			if (this.hasIntersection(point)) {
				result = true;
				break;
			}
		}
		console.log('trail:', JSON.stringify(this._trail));
		return result
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

	private intitiateTree(): BalancedTree<TreeNode> {
		return new BalancedTree<TreeNode>((a: TreeNode, b: TreeNode) => { return a.yAxis - b.yAxis })
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
		console.log('x', this.x)
		console.log('y', this.y)
		console.log('current heading', this.currentHeading)
		this.x += Math.round(Math.cos(this.currentHeading)) * this.speed;
		this.y += Math.round(Math.sin(this.currentHeading)) * this.speed;
		console.log('x', this.x)
		console.log('y', this.y)

		this.growTrail();
	}

	private createMinXCoordHeap(): PriorityQueue<Point> {
		const heap = this.newHeap();
		// get the points out of the trail and add to the heap
		for (let index = 0; index < this._trail.length; index++) {
			const segment = this._trail[index].line;
			heap.queue(this.deriveLeftPoint(segment, index));
			heap.queue(this.deriveRightPoint(segment, index));
		}
		return heap
	}

	private newHeap(): PriorityQueue<Point> {
		return new PriorityQueue(
			{ comparator: function(a: Point, b: Point) { return b.location.x - a.location.x; } }
		)
	}

	private hasIntersection(point: Point): boolean {
		console.log(`Checking intersection for point: ${JSON.stringify(point)}`);
		const segment = this._trail[point.segmentIndex].line;
		const { y } = point.location
		if (point.isLeft) {
			return this.hasLeftIntersection(segment, y)
		} else {
			return this.hasRightIntersection(segment, y)
		}
	}

	private deriveLeftPoint(segment: LineSegment, index: number): Point {
		const point = this.pointFromIndex(index);
		point.isLeft = true;
		// set the point's location to coordinate with the leftmost X
		point.location = segment.start.x < segment.end.x ? segment.start : segment.end;
		return point
	}

	private deriveRightPoint(segment: LineSegment, index: number): Point {
		const point = this.pointFromIndex(index);
		point.isLeft = false;
		// set the point's location to coordinate with the rightmost X
		point.location = segment.start.x < segment.end.x ? segment.end : segment.start;
		return point
	}

	private pointFromIndex(index: number): Point {
		const point: Point = {
			segmentIndex: index,
			location: { x: -1, y: -1 },
			isLeft: false
		}
		return point
	}

	private hasLeftIntersection(segment: LineSegment, yAxis: number): boolean {
		this.bst.insert({ yAxis, segment });
		const { predecessor, successor } = this.getNeighbors(segment, yAxis);
		//determine if the segment crosses the predecessor or successor
		return this.crosses(segment, predecessor) || this.crosses(segment, successor)
	}

	private hasRightIntersection(segment: LineSegment, yAxis: number): boolean {
		const { predecessor, successor } = this.getNeighbors(segment, yAxis);
		return this.crosses(predecessor, successor)
	}

	private getNeighbors(segment: LineSegment, yAxis: number): Neighbors {
		let current = this.bst.root;
		while (current !== null) {
			if (this.areEqualTreeNodes(current.value, { yAxis, segment })) {
				return { predecessor: this.findPredecessor(current.left), successor: this.findSucessor(current.right) }
			} else {
				// continue the search
				current = current.value.yAxis > yAxis ? current.right : current.left;
			}
		}

		return { predecessor: null, successor: null }
	}

	private areEqualTreeNodes(a: TreeNode, b: TreeNode): boolean {
		if (a.yAxis !== b.yAxis) {
			return false
		}
		if (a.segment.start.x !== b.segment.start.x) {
			return false
		}
		if (a.segment.start.y !== b.segment.start.y) {
			return false
		}
		if (a.segment.end.x !== b.segment.end.x) {
			return false
		}
		return a.segment.end.y === b.segment.end.y
	}

	private findPredecessor(node: BalancedNode<TreeNode> | null): LineSegment | null {
		if (!node) {
			return null
		}
		let cur = node
		while (cur.right !== null) {
			cur = cur.right
		}
		return cur.value.segment
	}

	private findSucessor(node: BalancedNode<TreeNode> | null): LineSegment | null {
		if (!node) {
			return null
		}
		let cur = node
		while (cur.left !== null) {
			cur = cur.left
		}
		return cur.value.segment
	}

	private crosses(segmentA: LineSegment | null, segmentB: LineSegment | null): boolean {
		if (!segmentA || !segmentB || this.areParallel(segmentA, segmentB)) {
			return false;
		} else if (this.isVertical(segmentA)) {
			return this.isInRange(segmentA, segmentB)
		} else {
			// then segmentB is vertical
			return this.isInRange(segmentB, segmentA)
		}
	}

	private areParallel(segmentA: LineSegment, segmentB: LineSegment): boolean {
		// if both segments are vertical or both are horizontal, then they are parallel
		if (this.isVertical(segmentA) && this.isVertical(segmentB)) {
			return true;
		} else if (this.isHorizontal(segmentA) && this.isHorizontal(segmentB)) {
			return true;
		} else {
			return false;
		}
	}

	private isHorizontal(segment: LineSegment): boolean {
		return !this.isVertical(segment);
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
