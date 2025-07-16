import { PlayerInterface } from './interface';
import { ColorName } from '../game/color/color_name';
import { Coordinates, LineSegment } from '../geometry/interfaces';
import { NINETY_DEGREES } from '../geometry/constants';
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
		this.rotate(NINETY_DEGREES);
	}

	turnRight(): void {
		this.rotate(-NINETY_DEGREES);
	}

	move(): void {
		this.adjustCamera();
		this.moveAlongHeading();
		this.redirectIfTurned();
	}

	private redirectIfTurned(): void {
		if (this.cameraTurnHasCompleted()) {
			this.redirect();
		}
	}

	private redirect(): void {
		this.isTurning = false;
		this.heading = this.angle;
		this.addTrailSegment();
	}

	private adjustCamera(): void {
		if (this.cameraIsRotating()) {
			this.incrementCamera();
		}
	}

	private addTrailSegment(): void {
		this._trail.push({ start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y } });
	}

	private cameraTurnHasCompleted(): boolean {
		return this.inbetweens.length === 0 && this.isTurning;
	}

	private growTrail(): void {
		this._trail[this._trail.length - 1].end = { x: this.x, y: this.y };
	}

	private moveAlongHeading(): void {
		this.x += Math.round(Math.cos(this.heading)) * this.speed;
		this.y += Math.sin(this.heading) * this.speed;
		this.growTrail();
	}

	private cameraIsRotating(): boolean {
		return this.inbetweens.length > 0
	}

	private incrementCamera(): void {
		this.angle += this.inbetweens.shift()!;
		this.angle = normalizeAngle(this.angle);
	}

	private rotate(angle: number): void {
		if (this.isTurning) {
			return
		}
		this.isTurning = true;
		this.heading = normalizeAngle(this.heading + angle);
		this.fillInbetweens(angle);
	}

	private fillInbetweens(angle: number): void {
		const frames = Math.floor(this.turnDistance / this.speed)
		const sign = angle > 0 ? 1 : -1;
		for (let i = 0; i < frames; i++) {
			this.inbetweens.push(sign * ((Math.PI) / 2) / frames);
		}
	}
}
export { Player };
