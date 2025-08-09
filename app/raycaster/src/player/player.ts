import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../wall/interface';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { ArenaInterface } from '../arena/interface'
import PriorityQueue from 'ts-priority-queue'
import { BalancedTree, BalancedNode } from 'data-balanced-tree';
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
	private treeCompare(nodeA: TreeNode, nodeB: TreeNode): number {
		const segmentA = this._trail[nodeA.trailIndex].line
		const segmentB = this._trail[nodeB.trailIndex].line

		const minAY = this.minY(segmentA)
		const minBY = this.minY(segmentB)
		if (minAY !== minBY) {
			return minAY - minBY
		}

		const maxAY = this.maxY(segmentA)
		const maxBY = this.maxY(segmentB)
		if (maxAY !== maxBY) {
			return maxAY - maxBY
		}

		const minAX = this.minX(segmentA)
		const minBX = this.minX(segmentB)
		if (minAX !== minBX) {
			return minAX - minBX
		}

		const maxAX = this.maxX(segmentA)
		const maxBX = this.maxX(segmentB)
		return maxAX - maxBX
	}

	private intitiateTree(): BalancedTree<TreeNode> {
		return new BalancedTree<TreeNode>(this.treeCompare.bind(this));
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
			{
				comparator: function(a: Point, b: Point) {
					if (a.location.x === b.location.x) {
						return a.location.y - b.location.y;
					}
					return a.location.x - b.location.x
				}
			}
		)
	}

	private hasIntersection(point: Point): boolean {
		const { y } = point.location
		if (point.isLeft) {
			return this.hasLeftIntersection(y, point.trailIndex)
		} else {
			return this.hasRightIntersection(y, point.trailIndex)
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
			trailIndex: index,
			location: { x: -1, y: -1 },
			isLeft: false
		}
		return point
	}

	private hasLeftIntersection(yAxis: number, trailIndex: number): boolean {
		this.bst.insert({ yAxis, trailIndex });
		const { predecessor, successor } = this.getNeighbors(yAxis, trailIndex);
		const predIdx = predecessor?.trailIndex ?? null;
		const succIdx = successor?.trailIndex ?? null;
		//determine if the segment crosses the predecessor or successor
		if (this.crosses(trailIndex, predIdx)) {
			return true;
		}

		return this.crosses(trailIndex, succIdx);
	}

	private hasRightIntersection(yAxis: number, trailIndex: number): boolean {
		const { predecessor, successor } = this.getNeighbors(yAxis, trailIndex);
		const predInx = predecessor?.trailIndex ?? null;
		const succInx = successor?.trailIndex ?? null;
		//remove the current node from the tree
		this.bst.delete({ yAxis, trailIndex });

		return this.crosses(predInx, succInx)
	}

	private getNeighbors(yAxis: number, trailIndex: number): Neighbors {
		let current = this.bst.root;
		while (current !== null) {
			if (this.areEqualTreeNodes(current.value, { yAxis, trailIndex })) {
				return {
					predecessor: this.findPredecessor(current.left),
					successor: this.findSucessor(current.right)
				}
			} else {
				const c = this.treeCompare(current.value, { yAxis, trailIndex });
				// continue the search
				current = c < 0 ? current.right : current.left;
			}
		}

		return { predecessor: null, successor: null }
	}

	private areEqualTreeNodes(a: TreeNode, b: TreeNode): boolean {
		return a.trailIndex === b.trailIndex
	}

	private findPredecessor(node: BalancedNode<TreeNode> | null): TreeNode | null {
		if (!node) {
			return null
		}
		let cur = node
		while (cur.right !== null) {
			cur = cur.right
		}
		return cur.value
	}

	private findSucessor(node: BalancedNode<TreeNode> | null): TreeNode | null {
		if (!node) {
			return null
		}
		let cur = node
		while (cur.left !== null) {
			cur = cur.left
		}
		return cur.value
	}

	private crosses(indexA: number | null, indexB: number | null): boolean {
		// if either node is null, then they can't cross
		if (indexA === null || indexB === null) {
			return false;
		}
		// if the segments are adjacent, then they can't cross
		if (Math.abs(indexA - indexB) === 1) {
			return false;
		}
		// get the segments from the trail
		const segmentA = this._trail[indexA].line;
		const segmentB = this._trail[indexB].line;
		// if either segment is null, or they are parallel, then they can't cross
		if (this.areParallel(segmentA, segmentB)) {
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
