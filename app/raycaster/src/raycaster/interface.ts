interface RaycasterInterface {
	getViewRays(viewerAngle: number): Array<number>;
	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number;
	wallHeightToSliceHeight(distance: number, height: number): number;
}
export { RaycasterInterface }
