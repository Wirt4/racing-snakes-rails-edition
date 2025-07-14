import { PlayerInterface } from './interface';
import { Coordinates } from '../geometry/interfaces';
class Player implements PlayerInterface {
	x: number;
	y: number;
	angle: number;
	private speed: number;
	constructor(coordinates: Coordinates, angle: number, speed: number) {
		this.speed = speed;
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.angle = angle;
	}

	rotate(angle: number): void {
		this.angle += angle;
	}

	move(): void {
		this.x += Math.round(Math.cos(this.angle)) * this.speed;
		this.y -= Math.sin(this.angle) * this.speed;
	}
}
export { Player };
