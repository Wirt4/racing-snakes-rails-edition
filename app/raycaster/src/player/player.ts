import { PlayerInterface } from './interface';
import { ColorName } from '../game/color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { normalizeAngle } from '../utils';

class Player implements PlayerInterface {
	x: number;
	y: number;
	private isTurning: boolean = false;
	private inbetweens: Array<number> = [];
	private _trail: LineSegment[] = [];
	private heading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };

	constructor(
		coordinates: Coordinates,
		public angle: number,
		private speed: number,
		private turnDistance: number
	) {
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.heading = angle;
		this.lastPosition = { x: this.x, y: this.y };
		this._trail = [{ start: this.lastPosition, end: this.lastPosition }];
	}

	get color(): ColorName {
		return ColorName.RED;
	}

	get trail(): LineSegment[] {
		return this._trail;
	}

	turnLeft(): void {
		this.rotate((Math.PI / 2));
	}

	turnRight(): void {
		this.rotate(-(Math.PI / 2));
	}
	private rotate(angle: number): void {
		if (this.isTurning) {
			return
		}
		this.isTurning = true;
		this.heading = normalizeAngle(this.heading + angle);
		this.fillInbetweens(angle);
	}

	move(): void {
		// if turning, add the appropriate angle increment here
		if (this.inbetweens.length > 0) {
			this.angle += this.inbetweens.shift()!;
			this.angle = normalizeAngle(this.angle);
			this._trail[this._trail.length - 1].end = this.lastPosition; //stitch walls together
			this._trail.push({ start: this.lastPosition, end: this.lastPosition });
		} else {
			this.isTurning = false;
			this.angle = this.heading;
		}
		this.x += Math.round(Math.cos(this.heading)) * this.speed;
		this.y += Math.sin(this.heading) * this.speed;
		this._trail[this._trail.length - 1].end = this.lastPosition;
		this.lastPosition = { x: this.x, y: this.y };
	}

	private fillInbetweens(angle: number): void {
		const frames = Math.floor(this.turnDistance / this.speed)
		const sign = angle > 0 ? 1 : -1;
		for (let i = 0; i < frames; i++) {
			this.inbetweens.push(sign * ((Math.PI) / 2) / frames);
		}
		//might be stuck at constant speed here
	}
}
export { Player };
