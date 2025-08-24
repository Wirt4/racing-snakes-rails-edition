import { RaycasterInterface } from './interface';
import {
	assertIsPositiveInteger,
	normalizeAngle,
	assertIsNonNegative,
	assertIsPositive,
	assertAreNonNegativeCoordinates
} from '../utils/utils';
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
	private currentGridDistances: Array<number>;
	private rays: Float32Array;
	private gridStepCounter: XYGridStepGenerators

	constructor(
		private resolution: number,
		private fieldOfView: number,
		private screenWidth: number,
		private screenHeight: number,
		private maxDistance: number,
		private horizonY: number,
		private wallHeight: number,
		private cameraHeight: number,
		cellSize: number

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
		this.currentGridDistances = new Array<number>
		this.gridStepCounter = new XYGridStepGenerators(cellSize)
		this.rays = new Float32Array(resolution)
	}

	castRay(origin: Coordinates, angle: number, walls: WallInterface[]): Slice {
		assertAreNonNegativeCoordinates(origin)
		this.currentRay.setUp(origin, angle)
		this.currentRay.findClosestHit(walls);
		const distance = this.currentRay.wallDistance > 0 ? this.currentRay.wallDistance : this.maxDistance;
		this.currentSlice.distance = distance
		this.currentSlice.intersection = this.currentRay.wallIntersection;
		this.currentSlice.gridHits = this.getGrid(origin, angle, distance)
		this.currentSlice.color = this.currentRay.wallColor;
		return this.currentSlice
	}
	/**
	 * This routine takes in the origin and angle for the point of view as well as a maximum distance
	 * and returns an array of numbers which are the distances of the floor grid lines visible from that slice
	 * **/
	private getGrid(origin: Coordinates, angle: number, maxDistance: number): Array<number> {
		/**
		 * preconditions
		 * angle is between 0 and 2pi inclusive
		 * maximum distance is positive
		 * both the x and y coordinates are non-negative
		 **/
		assertAreNonNegativeCoordinates(origin)
		angle = normalizeAngle(angle)
		assertIsPositive(maxDistance)
		// initialize the gridStep counter
		this.gridStepCounter.init(origin, angle)
		//reset the griddistances array
		this.currentGridDistances.length = 0

		while (true) {
			// currentDistance is the minimum of the current x and y steps
			const currentDistance = Math.min(this.gridStepCounter.peekX(), this.gridStepCounter.peekY())
			// check for the break condition
			// is not valid (such as exceeding maxDistance), go straight to end of method
			if (currentDistance <= 0 || currentDistance > maxDistance) {
				break;
			}
			// otherwise append currentDistance to the grid distances
			this.currentGridDistances.push(currentDistance)
			// if currentX = currentY, then it's a corner, and advance both
			if (
				this.gridStepCounter.peekX() === this.gridStepCounter.peekY()
			) {
				this.gridStepCounter.advanceX()
				this.gridStepCounter.advanceY()
				continue;
			}
			if (
				// if current X is less than current Y, advance the x value
				this.gridStepCounter.peekX() < this.gridStepCounter.peekY()
			) {
				this.gridStepCounter.advanceX();
				continue;
			}
			// if current Y is less than current X, advance current Y
			this.gridStepCounter.advanceY();
		}
		// break jumps here
		return this.currentGridDistances
	}

	fillRaysInto(rays: Float32Array, viewerAngle: number): void {
		for (let i = 0; i < this.resolution; i++) {
			rays[i] = normalizeAngle(viewerAngle - this.fovOffset + this.offsets[i]);
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
		if (viewerAngle < 0 || viewerAngle > FULL_CIRCLE) {
			throw ('invalid angle')
		}
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

/** this class  is to simplifies and coordinates the step counting for the grid so wont have to track the X stack and Y stacks separately **/

class XYGridStepGenerators {
	private _xStep: GridStepGenerator;
	private _yStep: GridStepGenerator;
	private bMath: BMath;

	/**
	 *Constructor uses cellSize because that is the invariant from which calculations are derived
	 * creates a class as if intialized with an angle of 0 and coordinates of (0,0)
	 * */
	constructor(cellSize: number) {
		// precondition: cellSize is a positive integer
		assertIsPositiveInteger(cellSize)
		// passes cell size to its members
		this._xStep = new GridStepGenerator(cellSize);
		this._yStep = new GridStepGenerator(cellSize);
		// (0,0) origin and 0 degree angle
		this._xStep.init(0, 1);
		this._yStep.init(0, 0);
		//use bMath class for caching and consistency
		this.bMath = BMath.getInstance()
	}

	/**
	 * sets the x and y steps based on the input location and angle
	 * if heap memory wasn't an issue, these would be constructor arguments
	**/
	init(origin: Coordinates, angle: number): void {
		//inputs coordinates object and number for angle
		/**
		 * preconditions: coordinates are both non negative
		 * angle is greater or equal than 0 and less than or equal to 2 Pi (FULL_CIRCLE)
		 */
		angle = normalizeAngle(angle)
		assertAreNonNegativeCoordinates(origin)
		// init x-step with x and cos of angle
		this._xStep.init(origin.x, this.bMath.cos(angle))
		// init y-step with y and sin of angle
		this._yStep.init(origin.y, this.bMath.sin(angle))
	}

	/**
	 * returns the current step value on the x axis
	 */
	peekX(): number {
		return this._xStep.peek()
	}

	/**
	 * returns the current step value on the y axis
	 */
	peekY(): number {
		//hides how that X is gotten
		return this._yStep.peek()
	}

	/**
	 * advances the current x value along the x axis according the angle passed in init()
	 */
	advanceX(): void {
		this._xStep.advance()
	}

	/**
	 * advances the current x value along the y axis according the angle passed in init()
	 */
	advanceY(): void {
		this._yStep.advance()
	}
}
/**
 * contains the current location along an x or y axis, the step to iterated it, and the means to instantiate and advance to the next step
 * **/
class GridStepGenerator {
	private _cellSize: number
	private _gridLocation: number
	private _step: number
	/**
	 * Initiates the object with a cell size, size the cell is constant
	 * **/
	constructor(cellSize: number) {
		//preconsition: cellSize is a positive integer
		assertIsPositiveInteger(cellSize)
		this._cellSize = cellSize
		// gridlocation and step are set by the init() method
		this._gridLocation = -1
		this._step = -1
	}
	/** 
	 * Sets the state of the object based on origin location and ratio
	 * (a directional adjustment, an output of the trigonometric operation on the angle)
	 *
	 * If memory allocation wasn't at a premium in this instance, it would be a constructor argument
	 *  **/
	init(origin: number, ratio: number): void {
		//preconditions: origin is nonnegative, and ratio is the output of either a sin or cos function
		assertIsNonNegative(origin)
		if (ratio < -1 || ratio > 1) {
			throw new Error("ratio must be be between -1 and 1 inclusive");
		}

		// set step and current Location to infinity
		this._step = Number.POSITIVE_INFINITY;
		this._gridLocation = Number.POSITIVE_INFINITY;
		// if ratio is 0, then return
		if (ratio == 0) {
			return;
		}
		// create a temporary variable cellIndx, which is the floor of origin/ cellSize
		let cellIndx = Math.floor(origin / this._cellSize);
		// we need to determine nextGridLocation
		// if ratio is positive increase cellIndex by one
		if (ratio > 0) {
			cellIndx++;
		}
		//If there's a verical line decrement cellIndex by one
		if (ratio < 0 && origin % this._cellSize === 0) {
			cellIndx--;
		}
		// nextGridLocation is the cellIndex times the cell size
		const nextGridLocation = cellIndx * this._cellSize;
		// step is the absolute value of cell/directionx
		this._step = Math.abs(this._cellSize / ratio)
		// finally, current is (nextGridLocation - origin  location) / ratio
		this._gridLocation = (nextGridLocation - origin) / ratio
		// if current x is less than or equal to zero, add a step to it to make it positive
		if (this._gridLocation <= 0) {
			this.advance()
		}
	}
	/**
	 * Returns the current location
	 **/
	peek(): number {
		return this._gridLocation;
	}

	/**
	 * Iterates class to the next location
	*/
	advance(): void {
		this._gridLocation += this._step;
	}
}

interface Intersection {
	distance: number;
	coordinates: Coordinates;
}

export { Raycaster };
