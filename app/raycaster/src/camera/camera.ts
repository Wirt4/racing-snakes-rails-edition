import { Directions } from '../controls/directions';
class Camera {
	isRotating: boolean = false
	beginTurnExecution(turnDirection: Directions): void {
		this.isRotating = true;
	}
}
export { Camera }
