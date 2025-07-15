interface RaycasterInterface {
	getViewRays(viewerAngle: number): Float32Array;
	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number;
	calculateBrightness(distance: number): number;
	focalLength: number;
}
export { RaycasterInterface }
