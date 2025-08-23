import { RaycasterInterface } from './interface';
import { assertIsPositiveInteger, assertIsNonNegative, assertIsPositive } from '../utils/utils';
import { FULL_CIRCLE, NINETY_DEGREES } from '../geometry/constants';
import { BMath } from '../boundedMath/bmath';
import { Slice } from '../slice/interface';
import { ColorName } from '../color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { WallInterface } from '../wall/interface';

class Raycaster implements RaycasterInterface {
	public focalLength: number;
	private offsets: Array<number>;
	private fovOffset: number;
	private bMath: BMath = BMath.getInstance();
	private currentSlice: Slice
	private currentRay: Ray

	constructor(
		private resolution: number,
		private fieldOfView: number,
		private screenWidth: number,
		private screenHeight: number,
		private maxDistance: number = 1000,
		private horizonY: number,
		private wallHeight: number,
		private cameraHeight: number,
		private rays: Float32Array = new Float32Array(resolution)

	) {
		/**
		 *invariants: fieldOfView is between 0 and 2*Math.PI
		 * resolution is a positive integer
		 **/
		this.fieldOfView = fieldOfView;
		assertIsPositiveInteger(this.resolution);
		if (this.fieldOfView < 0 || this.fieldOfView > FULL_CIRCLE) {
			throw new Error("Field of view must be between 0 and 2*Math.PI");
		}
		this.offsets = [];
		const step = this.fieldOfView / this.resolution;
		for (let i = this.resolution - step; i >= 0; i--) {
			this.offsets.push(i * step);
		}
		this.fovOffset = this.fieldOfView / 2;

		const aspectRatio = screenWidth / screenHeight;
		const verticalFOV = 2 * Math.atan(Math.tan(this.fieldOfView / 2) / aspectRatio);

		this.focalLength = this.screenWidth / (2 * Math.tan(verticalFOV / 2));
		this.currentRay = new Ray()
		this.currentSlice = {
			distance: -1,
			intersection: { x: -1, y: -1 },
			color: ColorName.NONE,
			gridHits: []
		}
	}

	castRay(origin: Coordinates, angle: number, walls: WallInterface[], gridLines: Array<LineSegment>): Slice {
		this.currentRay.setUp(origin, angle)
		this.currentRay.findClosestHit(walls);
		const distance = this.currentRay.wallDistance > 0 ? this.currentRay.wallDistance : this.maxDistance;
		const intersection = this.currentRay.wallIntersection;
		const color = this.currentRay.wallColor;
		const gridHits = this.currentRay.gridHits(gridLines, distance);
		// don't allocate a whole new slice
		this.currentSlice.distance = distance
		this.currentSlice.intersection = intersection
		this.currentSlice.gridHits = gridHits
		this.currentSlice.color = color
		return this.currentSlice
	}

	//information hidden
	// -- the routine hides how it knows the distance to each grid line distance
	// //inputs the origin coordinates, angle and maximum distance
	//outputs an array of numbers, all visible grid thingies
	//preconditions
	// --angle is between 0 and 2pi inclusive
	// -- maximum distance is positive
	// --both the x and y coordinates are positive
	//postconditions
	// --returned array has 0 or more items, all numbers representing the distance to the gridline

	fillRaysInto(rays: Float32Array, viewerAngle: number): void {
		for (let i = 0; i < this.resolution; i++) {
			rays[i] = this.normalizeAngle(viewerAngle - this.fovOffset + this.offsets[i]);
		}
	}

	getViewRays(viewerAngle: number): Float32Array {
		/*Precondition: 0<=viewerAngle<=2*Math.PI
		 * Postconditions: 
		 * returns an array of rays
		 * each ray is also between 0 and 2* math.pi (inclusive)
		 * The length of the array is equal to the resolution
		 * the array is arranged from 
		 */
		this.fillRaysInto(this.rays, viewerAngle);
		return this.rays;
	}

	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number {
		/**
		 * Precondition: distance is a positive number, angle is between 0 and 2*Math.PI
		 * Postcondition: returns the corrected distance, the greater the distance between the center and relative angle, the greater the correction
		 * This is to account for the fish-eye effect in a raycaster
		 */
		if (this.fieldOfView >= NINETY_DEGREES) {
			return distance; //no correction needed for wide FOV
		}
		return distance * this.bMath.cos(relativeAngle - centerAngle);
	}

	wallHeightToSliceHeight(distance: number, height: number): number {
		/**
		 * Precondition: distance is a non-negative number, height is a positive number
		 * Postcondition: returns the height of the slice in pixels, must be a positive number
		 * */
		assertIsNonNegative(distance);
		assertIsPositive(height);
		if (distance === 0) {
			return this.screenHeight;
		}
		const wallBase = 0; // world Y = 0
		const wallTop = wallBase + this.wallHeight;

		// distances from eye
		const topOffset = wallTop - this.cameraHeight;
		const bottomOffset = wallBase - this.cameraHeight;

		// project both
		const topY = this.horizonY - (topOffset * this.focalLength) / distance;
		const bottomY = this.horizonY - (bottomOffset * this.focalLength) / distance;

		return bottomY - topY;
	}

	calculateBrightness(distance: number): number {
		if (distance > this.maxDistance) {
			return 0;
		}
		return 100 * (1 - (distance / this.maxDistance));
	}

	private normalizeAngle(angle: number): number {
		if (angle < 0) {
			return angle + FULL_CIRCLE;
		}
		if (angle > FULL_CIRCLE) {
			return angle - FULL_CIRCLE;
		}
		return angle;
	}
}

class Ray {
	private x1: number = -1
	private x2: number = -1
	private x3: number = -1
	private x4: number = -1
	private y1: number = -1
	private y2: number = -1
	private y3: number = -1
	private y4: number = -1
	private denominator: number = -1
	private _wallDistance: number | null = -1
	private _wallColor: ColorName = ColorName.NONE
	private _wallIntersection: Coordinates = { x: -1, y: -1 }
	private offset: number = 10
	private gridDistances: Array<number> = new Array<number>()
	private bMath: BMath = BMath.getInstance()


	/**
	 * this method calculates the values of x1, y1, x2, and y2 based on position and angle passed here.
	 * It's an alternative to instantiating a whole new class on every tick.
	 * **/
	setUp(origin: Coordinates, angle: number): void {
		// set x1 and y1 to the origin coordinates (argument)
		this.x1 = origin.x
		this.y1 = origin.y
		// use the offset and angle to determine x2 and x3
		// TODO: test with bMath or some caching to squeeze some performance
		this.x2 = this.x1 + (this.offset * this.bMath.cos(angle))
		this.y2 = this.y1 + (this.offset * this.bMath.sin(angle))
	}

	findClosestHit(walls: Array<WallInterface>): void {
		this._wallDistance = null
		for (let i = 0; i < walls.length; i++) {
			const wall = walls[i]
			const intersection: Intersection | null = this.findIntersection(wall.line)
			if (intersection !== null) {
				if (this._wallDistance === null || intersection.distance < this._wallDistance) {
					this.setValues(intersection, wall.color)
				}
			}
		}
	}

	get wallIntersection(): Coordinates {
		return this._wallIntersection
	}

	get wallDistance(): number {
		return this._wallDistance || -1
	}

	get wallColor(): ColorName {
		return this._wallColor
	}

	gridHits(gridLines: Array<LineSegment>, maxDistance: number): Array<number> {
		//truncate the gridDistances array 
		// Not initiating a new one so not putting heap pressure on Spidermonkey
		this.gridDistances.length = 0
		for (let i = 0; i < gridLines.length; i++) {
			const intersection = this.findIntersection(gridLines[i])
			if (intersection !== null && intersection.distance < maxDistance) {
				this.gridDistances.push(intersection.distance)
			}
		}
		return this.gridDistances
	}

	private findIntersection(lineSegment: LineSegment): Intersection | null {
		this.x3 = lineSegment.start.x
		this.x4 = lineSegment.end.x
		this.y3 = lineSegment.start.y
		this.y4 = lineSegment.end.y
		//denominator is (x1-x2)(y3-y4)-(y1-y2)(x3-x4)
		this.denominator = (this.x1 - this.x2) * (this.y3 - this.y4) - (this.y1 - this.y2) * (this.x3 - this.x4)

		if (this.denominator === 0) {
			return null;
		}

		const x = this.calculateIntersectionCoordinate(this.x1, this.x2, this.x3, this.x4)
		const y = this.calculateIntersectionCoordinate(this.y1, this.y2, this.y3, this.y4)

		if (!this.isValidIntersection(x, y)) {
			return null;
		}

		const distance = this.calculateDistance(x, y)

		return { coordinates: { x, y }, distance }
	}

	private calculateDistance(x: number, y: number): number {
		//pythagorean theorem
		const sum = Math.pow(x - this.x1, 2) + Math.pow(y - this.y1, 2)
		return Math.sqrt(sum)
	}

	private calculateIntersectionCoordinate(p1: number, p2: number, p3: number, p4: number): number {
		const variableA = p3 - p4
		const variableB = p1 - p2
		//numerator = (x1*y2 - y1*x2)variableA-variableB(x3*y4- y3*x4)
		const segmentA = (this.x1 * this.y2 - this.y1 * this.x2) * variableA
		const segmentB = variableB * (this.x3 * this.y4 - this.y3 * this.x4)
		const numerator = segmentA - segmentB
		return numerator / this.denominator
	}

	private setValues(intersection: Intersection, color: ColorName): void {
		this._wallDistance = intersection.distance
		this._wallColor = color
		this._wallIntersection = intersection.coordinates
	}

	private isValidIntersection(x: number, y: number): boolean {
		let result = false
		//  intersection must be in front of the ray
		if (this.isBehind(x, y)) {
			return result
		}
		// the line segment must contain the intersection
		if (!this.targetContains(x, y)) {
			return result
		}

		result = true
		return result
	}

	private isBehind(x: number, y: number): boolean {
		let result = false
		if (this.x1 === this.x2) {
			//check the y axis
			result = this.pointPrecedes(y, this.y1, this.y2)
		} else {
			//check the x axis
			result = this.pointPrecedes(x, this.x1, this.x2)
		}
		return result
	}

	private pointPrecedes(coordinatePoint: number, rayOrigin: number, rayPoint: number): boolean {
		let result = false
		if (coordinatePoint <= rayOrigin && rayOrigin < rayPoint) {
			result = true
		}
		if (coordinatePoint >= rayOrigin && rayOrigin > rayPoint) {
			result = true
		}
		return result
	}

	private targetContains(x: number, y: number): boolean {
		let result = false
		if (this.x3 === this.x4) {
			result = this.inRange(y, this.y3, this.y4)
		} else {
			result = this.inRange(x, this.x3, this.x4)
		}
		return result
	}

	private inRange(coordinatePoint: number, startRange: number, endRange: number): boolean {
		let result = false
		// if min(start,end) <= coordinatePoint <= max(start, end) , result is true
		if (Math.min(startRange, endRange) <= coordinatePoint) {
			if (coordinatePoint <= Math.max(startRange, endRange)) {
				result = true
			}
		}
		return result
	}
}

interface Intersection {
	distance: number;
	coordinates: Coordinates;
}

export { Raycaster };
