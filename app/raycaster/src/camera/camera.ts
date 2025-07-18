import { Directions } from '../controls/directions';
class Camera {
	private _isRotating: boolean = false;

	constructor(private readonly turnTime: number) { }

	get isRotating(): boolean {
		return this._isRotating;
	}
	beginTurnExecution(turnDirection: Directions): void {
		this._isRotating = true;
	}
	adjust(): void { }
}
export { Camera }
