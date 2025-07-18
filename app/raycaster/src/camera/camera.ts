import { Directions } from '../controls/directions';
class Camera {
	private _isRotating: boolean = false;
	get isRotating(): boolean {
		return this._isRotating;
	}
	beginTurnExecution(turnDirection: Directions): void {
		this._isRotating = true;
	}
}
export { Camera }
