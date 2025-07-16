import { PlayerInterface } from './interface';
import { ColorName } from '../game/color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { NINETY_DEGREES } from '../geometry/constants';
import { normalizeAngle } from '../utils';
import { WallInterface } from '../gamemap/interface';
import { BMath } from '../boundedMath/bmath';
class Player implements PlayerInterface {
	x: number;
	y: number;
	private isTurning: boolean = false;
	private inbetweens: Array<number> = [];
	private _trail: WallInterface[] = [];
	private currentHeading: number;
	private nextHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private bMath: BMath = BMath.getInstance();

	constructor(
		coordinates: Coordinates,
		public angle: number,
		private speed: number,
		private turnDistance: number,
		color: ColorName = ColorName.RED
	) {
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.currentHeading = angle;
		this.nextHeading = angle;
		this.lastPosition = { x: this.x, y: this.y };
		this._trail = [{ line: { start: this.lastPosition, end: this.lastPosition }, color: color }];
		this.color = color;
	}


	get trail(): WallInterface[] {
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
		this.currentHeading = this.nextHeading;
		this.addTrailSegment();
	}

	private adjustCamera(): void {
		if (this.cameraIsRotating()) {
			this.incrementCamera();
		}
	}

	private addTrailSegment(): void {
		this._trail.push({ line: { start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y } }, color: this.color })
	}

	private cameraTurnHasCompleted(): boolean {
		return this.inbetweens.length === 0 && this.isTurning;
	}

	private growTrail(): void {
		this._trail[this._trail.length - 1].line.end = { x: this.x, y: this.y };
	}

	private moveAlongHeading(): void {
		this.x += Math.round(this.bMath.cos(this.currentHeading)) * this.speed;
		this.y += this.bMath.sin(this.currentHeading) * this.speed;
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
		this.nextHeading = normalizeAngle(this.currentHeading + angle);
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
