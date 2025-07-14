import { PlayerInterface } from './interface';
import { Coordinates } from '../geometry/interfaces';
import { normalizeAngle } from '../utils';
class Player implements PlayerInterface {
	x: number;
	y: number;
	angle: number;
	private speed: number;
	private turnDistance: number;
	private isTurning: boolean = false;
	private inbetweens: Array<number> = [];

	constructor(coordinates: Coordinates, angle: number, speed: number, turnRadius: number = 10) {
		this.speed = speed;
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.angle = angle;
		this.turnDistance = turnRadius * Math.PI / 2 //a right angle turn
	}

	rotate(angle: number): void {
		console.log(`Rotating by ${angle} radians`);
		if (this.isTurning) {
			console.log("Already turning, cannot rotate again");
			return
		}
		this.isTurning = true;
		this.fillInbetweens(angle);
	}

	move(): void {
		// if turning, add the appropriate angle increment here
		if (this.inbetweens.length > 0) {
			this.angle += this.inbetweens.shift()!;
			this.angle = normalizeAngle(this.angle);
			//normalizeAngle is a utility function that ensures the angle is between 0 and 2*PI
			//normalize the angle to be between 0 and 2*PI
			//pop the angle fragment from the stack and ad it to the angle
		} else {
			this.isTurning = false;
		}
		this.x += Math.round(Math.cos(this.angle)) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;
	}

	private fillInbetweens(angle: number): void {
		const frames = Math.floor(this.turnDistance / this.speed) //or: the number of frames to lock ou
		for (let i = 0; i < frames; i++) {
			this.inbetweens.push(angle > 0 ? (Math.PI / 2) / frames : -(Math.PI / 2) / frames)
		}

	}
}
export { Player };
