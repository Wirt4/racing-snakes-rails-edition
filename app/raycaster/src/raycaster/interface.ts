interface RaycasterInterface {
	getViewRays(viewerAngle: number): Array<number>;
	removeFishEye(distance: number, centerAngle: number, relativeAngle: number): number;
}
export { RaycasterInterface }
