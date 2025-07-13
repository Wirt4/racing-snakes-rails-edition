import { Coordinates } from '../geometry/interfaces';
export interface PlayerInterface {
	position: Coordinates;
	rotate: (angle: number) => void;
	move: () => void;
	angle: number;
}
