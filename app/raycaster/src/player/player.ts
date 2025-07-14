import { ColorName } from '../game/color/color_name';
import { PlayerInterface } from './interface';
import { Coordinates } from '../geometry/interfaces';
class Player implements PlayerInterface {
	x: number = 10;
	y: number = 5;
	angle: number = 0;
	private speed: number;
	constructor(coordinates: Coordinates, angle: number = 0, speed: number) {
		this.speed = speed;
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.angle = angle;
	}

	rotate(angle: number): void {
		throw new Error('Method not implemented.');
	}

	move(): void {
		this.x += Math.round(Math.cos(this.angle)) * this.speed;
		this.y -= Math.sin(this.angle) * this.speed;
	}
}
export { Player };
