import { ColorName } from '../game/color/color_name';
import { PlayerInterface } from './interface';
import { Coordinates } from '../geometry/interfaces';
class Player implements PlayerInterface {
	x: number = 10;
	y: number = 5;
	angle: number = 0;
	constructor(coordinates: Coordinates, angle: number = 0, speed: number) {
	}
	rotate(angle: number): void {
		throw new Error('Method not implemented.');
	}
	move(): void {
	}
}
export { Player };
