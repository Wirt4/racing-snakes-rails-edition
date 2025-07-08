import { RaycasterInterface } from './interface';
import { assertIsPositiveInteger } from '../utils';

class Raycaster implements RaycasterInterface {
	private offsets: Set<number>;
	constructor(private resolution: number, private fieldOfView: number) {
		/**
		 *invariants: fieldOfView is between 0 and 2*Math.PI
		 * resolution is a positive integer
		 **/
		assertIsPositiveInteger(this.resolution);
		if (this.fieldOfView < 0 || this.fieldOfView > 2 * Math.PI) {
			throw new Error("Field of view must be between 0 and 2*Math.PI");
		}
		this.offsets = new Set<number>();
		const step = this.fieldOfView / this.resolution;
		for (let i = 0; i < this.resolution; i++) {
			this.offsets.add(i * step);
		}
	}

	getViewRays(viewerAngle: number): Set<number> {
		/*Precondition: 0<=viewerAngle<=2*Math.PI
		 * Postconditions: 
		 * returns an array of rays
		 * each ray is also between 0 and 2* math.pi (inclusive)
		 * The length of the array is equal to the resolution
		 * the array is arranged from 
		 */

		//start angle is viewerAngle - offset, end angle is viewerAngle + offset
		const rays: Set<number> = new Set<number>();
		this.offsets.forEach((offset) => {
			rays.add(this.normalizeAngle(offset + viewerAngle - (this.fieldOfView / 2)));
		})
		return rays;
	}

	private normalizeAngle(angle: number): number {
		if (angle < 0) {
			return angle + 2 * Math.PI;
		}
		if (angle > 2 * Math.PI) {
			return angle - 2 * Math.PI;
		}
		return angle;
	}
}

export { Raycaster };
