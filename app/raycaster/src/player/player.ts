import { PlayerInterface } from './interface';
import { ColorName } from '../color/color_name';
import { Coordinates } from '../geometry/interfaces';
import { WallInterface } from '../gamemap/interface';
import { BMath } from '../boundedMath/bmath';
import { CameraInterface } from '../camera/interface';
import { Directions } from '../controls/directions';
import { TrailInterface } from '../trail/interface';

class Player implements PlayerInterface {
	x: number;
	y: number;
	private _temp: WallInterface[] = [];
	private currentHeading: number;
	private lastPosition: Coordinates = { x: 0, y: 0 };
	public color: ColorName;
	private bMath: BMath = BMath.getInstance();
	private isTurning: boolean = false;

	constructor(
		coordinates: Coordinates,
		private speed: number,
		color: ColorName = ColorName.RED,
		private camera: CameraInterface,
		public trail: TrailInterface
	) {
		this.x = coordinates.x;
		this.y = coordinates.y;
		this.currentHeading = camera.angle;
		this.lastPosition = { x: this.x, y: this.y };
		const startWall = { line: { start: this.lastPosition, end: this.lastPosition }, color };
		this._temp = [startWall];
		this.color = color;
	}

	get temp(): WallInterface[] {
		return this._temp;
	}

	get angle(): number {
		return this.camera.angle;
	}

	turnLeft(): void {
		this.turn(Directions.LEFT);
	}

	turnRight(): void {
		this.turn(Directions.RIGHT);
	}

	move(): void {
		this.adjustCamera();
		this.redirectIfTurned();
		this.moveAlongHeading();
	}

	private turn(dir: Directions): void {
		if (!this.isTurning) {
			this.camera.beginTurnExecution(dir);
			this.isTurning = true;
		}
	}

	private redirectIfTurned(): void {
		if (this.cameraTurnHasCompleted() && this.isTurning) {
			this.redirect();
			this.isTurning = false;
		}
	}

	private redirect(): void {
		this.addTrailSegment();
		this.currentHeading = this.camera.angle;
	}

	private adjustCamera(): void {
		if (this.camera.isRotating) {
			this.camera.adjust();
		}
	}

	private addTrailSegment(): void {
		this.trail.append(this.x, this.y);
		//this._temp.push({ line: { start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y } }, color: this.color })
	}

	private cameraTurnHasCompleted(): boolean {
		return !this.camera.isRotating;
	}

	private growTrail(): void {
		this._temp[this._temp.length - 1].line.end = { x: this.x, y: this.y };
	}

	private moveAlongHeading(): void {
		this.x += Math.round(this.bMath.cos(this.currentHeading)) * this.speed;
		this.y += this.bMath.sin(this.currentHeading) * this.speed;
		this.growTrail();
	}
}

export { Player };
