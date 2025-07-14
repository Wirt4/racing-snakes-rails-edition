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
		switch (this.angle) {
			case 0:
				this.x += this.speed;
				break;
			case 2 * Math.PI:
				this.x += this.speed;
				break;
			case Math.PI:
				this.x -= this.speed;
				break;
			case 3 * Math.PI / 2:
				this.y += this.speed;
				break;
			case Math.PI / 2:
				this.y -= this.speed;
				break;
		}
	}
}
export { Player };
