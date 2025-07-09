import { RaycasterInterface } from './interface';
import { assertIsPositiveInteger } from '../utils';
import { FULL_CIRCLE, NINETY_DEGREES } from '../geometry/constants';

class Raycaster implements RaycasterInterface {
	private offsets: Array<number>;
	private fovOffset: number;
	private fieldOfView: number;
	constructor(private resolution: number, fieldOfView: number) {
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
	}

	getViewRays(viewerAngle: number): Array<number> {
		/*Precondition: 0<=viewerAngle<=2*Math.PI
		 * Postconditions: 
		 * returns an array of rays
		 * each ray is also between 0 and 2* math.pi (inclusive)
		 * The length of the array is equal to the resolution
		 * the array is arranged from 
		 */

		//start angle is viewerAngle - offset, end angle is viewerAngle + offset
		const rays: Array<number> = new Array<number>();
		this.offsets.forEach((offset) => {
			rays.push(this.normalizeAngle(offset + viewerAngle - (this.fovOffset)));
		})
		return rays;
	}

	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number {
		/**
		 * Precondition: distance is a positive number, angle is between 0 and 2*Math.PI
		 * Postcondition: returns the corrected distance, the greater the ditstance between the center and relative angle, the greater the correction
		 * This is to account for the fish-eye effect in a raycaster
		 */
		if (this.fieldOfView >= NINETY_DEGREES) {
			return distance; //no correction needed for wide FOV
		}
		return distance * Math.cos(relativeAngle - centerAngle);
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

export { Raycaster };
