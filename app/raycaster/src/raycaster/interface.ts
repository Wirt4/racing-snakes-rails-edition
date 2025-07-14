interface RaycasterInterface {
	getViewRays(viewerAngle: number): Array<number>;
	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number;
	calculateBrightness(distance: number): number;
	focalLength: number;
}
export { RaycasterInterface }
