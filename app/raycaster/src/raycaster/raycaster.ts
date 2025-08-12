import { RaycasterInterface } from './interface';
import { assertIsPositiveInteger, assertIsNonNegative, assertIsPositive } from '../utils/utils';
import { FULL_CIRCLE, NINETY_DEGREES } from '../geometry/constants';
import { BMath } from '../boundedMath/bmath';
import { Slice } from '../slice/interface';
import { Coordinates, GeneralForm, LineSegment } from '../geometry/interfaces'
import { ColorName } from '../color/color_name'
import { WallInterface } from '../wall/interface'

class Raycaster implements RaycasterInterface {

	public focalLength: number;
	private offsets: Array<number>;
	private fovOffset: number;
	private bMath: BMath = BMath.getInstance();

	constructor(
		private resolution: number,
		private fieldOfView: number,
		private screenWidth: number,
		private screenHeight: number,
		private maxDistance: number = 1000,
		private horizonY: number,
		private wallHeight: number,
		private cameraHeight: number,
		private rays: Float32Array = new Float32Array(resolution),

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
	}

	castRay(position: Coordinates, angle: number, walls: WallInterface[]): Slice {
		const wall = walls[0]
		// use the wall intersection to find the distance
		const lineA = this.toLineSegment(position, angle)
		const intersection = this.getIntersection(lineA, wall.line)
		console.log('intersection', intersection)
		const distance = this.getDistance(position, intersection as Coordinates)
		return { distance, intersection: position, color: ColorName.RED, gridHits: [] }
	}

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

	private getDistance(pointA: Coordinates, pointB: Coordinates): number {
		const a = Math.abs(pointA.x - pointB.x)
		const b = Math.abs(pointA.y - pointB.y)
		const aSquared = Math.pow(a, 2)
		const bSquared = Math.pow(b, 2)
		const cSquared = aSquared + bSquared
		return Math.sqrt(cSquared)
	}


	private toLineSegment(position: Coordinates, angle: number): LineSegment {
		//Offset is arbitrary, just there because I'm superstitious about really small numbers
		const offset = 10
		const start = position
		const x = position.x + (offset * Math.cos(angle))
		const y = position.y + (offset * Math.sin(angle))
		const end = { x, y }
		return { start, end }
	}

	private getIntersection(lineA: LineSegment, lineB: LineSegment): Coordinates | null {
		const equationTemplate = new EquationTemplate(lineA, lineB)
		if (equationTemplate.intersectionExists()) {
			const x = equationTemplate.calculateIntersectionCoordinate(
				lineA.start.x,
				lineA.end.x,
				lineB.start.x,
				lineB.end.x
			)
			const y = equationTemplate.calculateIntersectionCoordinate(
				lineA.start.y,
				lineA.end.y,
				lineB.start.y,
				lineB.end.y
			)
			return { x, y }

		} else {
			console.log('intersection exists evaluated to false')
			return null
		}
	}

}
class EquationTemplate {
	private x1: number
	private x2: number
	private x3: number
	private x4: number
	private y1: number
	private y2: number
	private y3: number
	private y4: number
	private denominator: number

	constructor(lineA: LineSegment, lineB: LineSegment) {
		//Xs
		this.x1 = lineA.start.x
		this.x2 = lineA.end.x
		this.x3 = lineB.start.x
		this.x4 = lineB.end.x
		//and Ys
		this.y1 = lineA.start.y
		this.y2 = lineA.end.y
		this.y3 = lineB.start.y
		this.y4 = lineB.end.y
		// denominator = (x1-x2)(y3-y4)-(y1-y2)(x3-x4)
		const segmentA = (this.x1 - this.x2) * (this.y3 - this.y4)
		const segmentB = (this.y1 - this.y2) * (this.x3 - this.x4)
		this.denominator = segmentA - segmentB

	}

	//avoid divide-by-zero errors
	intersectionExists(): boolean {
		return this.denominator !== 0
	}

	// p may be the series for either Xs or Ys
	calculateIntersectionCoordinate(p1: number, p2: number, p3: number, p4: number): number {
		const variableA = p3 - p4
		const variableB = p1 - p2
		// numerator = (x1*y2 - y1*x2)variableA-variableB(x3*y4- y3*x4)
		const segmentA = (this.x1 * this.y2 - this.y1 * this.x2) * variableA
		const segmentB = variableB * (this.x3 * this.y4 - this.y3 * this.x4)
		const numerator = segmentA - segmentB
		return numerator / this.denominator
	}
}
export { Raycaster };
