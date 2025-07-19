import { Directions } from '../controls/directions';

interface CameraInterface {
	isRotating: boolean,
	angle: number,
	beginTurnExecution(turnDirection: Directions): void;
	adjust(): void;
}

export { CameraInterface };
