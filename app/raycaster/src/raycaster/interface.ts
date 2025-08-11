import { Slice } from '../slice/interface'

export interface RaycasterInterface {
	getViewRays(viewerAngle: number): Float32Array;
	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number;
	calculateBrightness(distance: number): number;
	focalLength: number;
	fillRaysInto(rays: Float32Array, viewerAngle: number): void;
	castRay(angle: number, distance: number): Slice;
}
