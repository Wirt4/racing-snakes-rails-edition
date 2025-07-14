import { Coordinates } from '../geometry/interfaces';
export interface PlayerInterface {
	rotate: (angle: number) => void;
	x: number;
	y: number;
	move: () => void;
	angle: number;
}
