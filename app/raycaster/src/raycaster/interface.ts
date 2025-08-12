import { Slice } from '../slice/interface'
import { Coordinates } from '../geometry/interfaces'

export interface RaycasterInterface {
	getViewRays(viewerAngle: number): Float32Array;
	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number;
	calculateBrightness(distance: number): number;
	focalLength: number;
	fillRaysInto(rays: Float32Array, viewerAngle: number): void;
	castRay(position: Coordinates, angle: number): Slice;
}
