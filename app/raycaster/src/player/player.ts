import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../gamemap/interface';
import { BMath } from '../boundedMath/bmath';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';

class Player implements PlayerInterface {
	x: number;
	y: number;
	private _trail: WallInterface[] = [];
	private currentHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private bMath: BMath = BMath.getInstance();
	private turning: boolean = false;

	constructor(
		coordinates: Coordinates,
		public angle: number,
		private speed: number,
		color: ColorName = ColorName.RED,
		private camera: CameraInterface
	) {
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.currentHeading = angle;
		this.lastPosition = { x: this.x, y: this.y };
		const startWall = { line: { start: this.lastPosition, end: this.lastPosition }, color };
		this._trail = [startWall];
		this.color = color;
	}

	get trail(): WallInterface[] {
		return this._trail;
	}

	turnLeft(): void {
		this.camera.beginTurnExecution(Directions.LEFT);
		this.turning = true;
	}

	turnRight(): void {
		this.camera.beginTurnExecution(Directions.RIGHT);
		this.turning = true;
	}

	move(): void {
		console.log(`Player is moving from (${this.x}, ${this.y}) with angle ${this.angle} and speed ${this.speed}`);
		this.adjustCamera();
		this.moveAlongHeading();
		this.redirectIfTurned();
	}

	private redirectIfTurned(): void {
		if (this.cameraTurnHasCompleted() && this.turning) {
			this.redirect();
			this.turning = false;
			this.angle = this.camera.angle;
		}
	}

	private redirect(): void {
		this.addTrailSegment();
	}

	private adjustCamera(): void {
		if (this.cameraIsRotating()) {
			this.camera.adjust();
		}
	}

	private addTrailSegment(): void {
		this._trail.push({ line: { start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y } }, color: this.color })
	}

	private cameraTurnHasCompleted(): boolean {
		return !this.cameraIsRotating();
	}

	private growTrail(): void {
		this._trail[this._trail.length - 1].line.end = { x: this.x, y: this.y };
	}

	private moveAlongHeading(): void {
		console.log('moveAlongHeading called');
		console.log(`Moving player at (${this.x}, ${this.y}) with heading ${this.currentHeading} and speed ${this.speed}`);
		this.x += Math.round(this.bMath.cos(this.currentHeading)) * this.speed;
		this.y += this.bMath.sin(this.currentHeading) * this.speed;
		this.growTrail();
	}

	private cameraIsRotating(): boolean {
		return this.camera.isRotating;
	}
}

export { Player };
